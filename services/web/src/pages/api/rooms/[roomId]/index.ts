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
import { ModelError } from "../../../../app/errors/ModelError";
import { apiRouter } from "../../../../app/utils/apiRouter";
import { HttpResult } from "../../../../app/utils/HttpResult";
import { UnauthorizedError } from "../../../../auth/errors/UnauthorizedError";
import {
  getAllParticipants,
  hasParticipantId,
  isHost,
  Participant,
} from "../../../../redis/models/participants";
import { getRoom, resetRoom } from "../../../../redis/models/rooms";
import { getRedisClient } from "../../../../redis/utils/getRedisClient";

interface Query {
  roomId: string;
}
const isQuery = (query: unknown): query is Query => {
  if (query == null) {
    return false;
  }
  return typeof (query as Query).roomId === "string";
};
export default apiRouter({
  GET: async (req, res) => {
    if (!isQuery(req.query)) {
      throw new HttpError(400);
    }
    const roomId = req.query.roomId;
    const [redis, quit] = getRedisClient();
    try {
      const [title, description, maximumParticipants] = await getRoom(
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
        const participants = await getAllParticipants(redis, roomId);
        // const chats = Not implemented
        result.participants = participants;
      }
      await quit();
      return new HttpResult(result, 200);
    } catch (error) {
      await quit();
      if (error instanceof ModelError) {
        throw new HttpError(error.code, error.message);
      }
      throw error;
    }
  },
  PUT: async (req, res) => {
    if (!isQuery(req.query)) {
      throw new HttpError(400);
    }
    const beforeRoomId = req.query.roomId;
    if (req.headers.authorization == null) {
      throw new UnauthorizedError(`Access to the room: ${beforeRoomId}`);
    }
    const [method, participantId] = req.headers.authorization.split(/\s+/);
    if (method !== "X-API-KEY") {
      throw new UnauthorizedError(`Access to the room: ${beforeRoomId}`);
    }
    const [redis, quit] = getRedisClient();
    try {
      if (!(await isHost(redis, beforeRoomId, participantId))) {
        throw new HttpError(403);
      }
      const roomId = await resetRoom(redis, beforeRoomId);
      await quit();
      return new HttpResult({ roomId }, 201);
    } catch (error) {
      await quit();
      if (error instanceof ModelError) {
        throw new HttpError(error.code, error.message);
      }
      throw error;
    }
  },
});
