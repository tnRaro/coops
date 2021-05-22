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
        const [method, participantId] = req.headers.authorization.split(/\s+/);
        if (method === "X-API-KEY") {
          if (
            redis.participant.CRUD.hasParticipantId(
              client,
              roomId,
              participantId,
            )
          ) {
            hasAuth = true;
          } else {
            throw new HttpError(403);
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
        participants: redis.participant.types.Participant[];
        chats: string[];
      };
      if (hasAuth) {
        const participants = await logic.participant.findAllParticipants(
          client,
          roomId,
        );
        // const chats = Not implemented
        result.participants = participants;
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
