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

import { HttpError } from "../../../../app/errors/HttpError";
import { apiRouter } from "../../../../app/utils/apiRouter";
import { auth } from "../../../../app/utils/auth";
import { HttpResult } from "../../../../app/utils/HttpResult";
import { isRoomIdQuery } from "../../../../app/utils/queries";
import { findAllParticipants } from "../../../../participants/logic/findAllParticipants";
import { validateHost } from "../../../../participants/logic/validateHost";
import { hasParticipantId } from "../../../../participants/redis/CRUD/hasParticipantId";
import { Participant } from "../../../../participants/redis/types";
import { withRedisClient } from "../../../../redis/utils/withRedisClient";
import { resetRoom } from "../../../../rooms/logic/resetRoom";
import { findRoomById } from "../../../../rooms/redis/CRUD";

export default apiRouter({
  GET: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    return withRedisClient(async (redis) => {
      const [title, description, maximumParticipants] = await findRoomById(
        redis,
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
          if (hasParticipantId(redis, roomId, participantId)) {
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
        participants: Participant[];
        chats: string[];
      };
      if (hasAuth) {
        const participants = await findAllParticipants(redis, roomId);
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
    return withRedisClient(async (redis) => {
      await validateHost(redis, beforeRoomId, authorId);
      const roomId = await resetRoom(redis, beforeRoomId);
      return new HttpResult({ roomId }, 201);
    });
  },
});
