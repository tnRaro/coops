/**
 * Allow: GET, PUT
 *
 * GET /api/rooms/:room-id
 *
 * 방 정보를 가져옴
 *
 * - success: 200
 * - invalid query: 400
 * - unauthorized user for the room: 401
 * - no room: 404
 *
 * ```
 * Response Body
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   maximumParticipants: number,
 *   participants: Participant[],
 *   chats: Chat[]
 * }
 * Participant {
 *   isHost: boolean,
 *   name: string,
 *   peerId: string,
 *   volume: number, // 0~200
 *   muteAudio: boolean,
 *   muteSpeaker: boolean,
 * }
 * Chat {
 *   name: string,
 *   message: string,
 *   createdAt: Date,
 * }
 * ```
 *
 * PUT /api/rooms/:room-id
 *
 * (방 관리자) 방을 초기화 함
 *
 * - success: 200
 * - invalid query: 400
 * - unauthorized user for the room: 401
 * - not a host: 403
 * - no room: 404
 *
 * ```
 * Response Body
 * {
 *   roomId: string
 * }
 * ```
 */

import { HttpResult } from "@coops/core";
import { HttpError } from "@coops/error";
import { withRedisClient } from "@coops/redis";
import * as redis from "@coops/redis";
import * as logic from "@coops/logic";

import { apiRouter } from "../../../../app/utils/apiRouter";
import { auth } from "../../../../app/utils/auth";
import { isRoomIdQuery } from "../../../../app/utils/queries";

export default apiRouter({
  GET: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    return withRedisClient(async (client) => {
      const [
        title,
        description,
        maximumParticipants,
      ] = await redis.room.CRUD.findRoomById(
        client,
        roomId,
        "title",
        "description",
        "maximumParticipants",
      );
      if (title == null) {
        throw new HttpError(404);
      }
      let hasAuth = false;
      if (req.headers.authorization != null) {
        const authorId = auth(req, `Access to the room: ${roomId}`);
        try {
          const isParticipant = await logic.participant.isParticipant(
            client,
            roomId,
            authorId,
          );
          hasAuth = isParticipant;
        } catch (error) {
          if (error instanceof HttpError) {
            if (error.code !== 404) {
              throw error;
            }
          } else {
            throw error;
          }
        }
      }
      const result = {
        roomId,
        title,
        description,
        maximumParticipants:
          maximumParticipants == null ? null : Number(maximumParticipants),
        participants: [],
        chats: [],
      } as {
        roomId: string;
        title: string;
        description: string;
        maximumParticipants: number;
        participants: Partial<redis.participant.types.Participant>[];
        chats: string[];
      };
      if (hasAuth) {
        const participants = await logic.participant.findAllParticipants(
          client,
          roomId,
        );
        result.participants = participants.map((participant) => ({
          ...participant,
          participantId: undefined,
        }));
        const chats = await logic.chat.findAllChats(client, roomId);
        result.chats = chats.map((chat) => JSON.stringify(chat));
      }
      return new HttpResult(result, 200);
    });
  },
  PUT: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const beforeRoomId = req.query.roomId;
    const authorId = auth(req, `Access to the room: ${beforeRoomId}`);
    return withRedisClient(async (client) => {
      await logic.participant.validateHost(client, beforeRoomId, authorId);
      const roomId = await logic.room.resetRoom(client, beforeRoomId);
      return new HttpResult({ roomId }, 201);
    });
  },
});
