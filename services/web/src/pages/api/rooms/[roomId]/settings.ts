/**
 * Allow: PUT
 *
 * PUT /api/rooms/:room-id/settings
 *
 * (방 관리자) 방 설정을 변경
 *
 * - success: 200
 * - invalid query or body: 400
 * - unauthorized user for the room: 401
 * - not a host: 403
 * - no room: 404
 *
 * ```
 * Request Body
 * {
 *   title?: string,
 *   description?: string,
 *   maximumParticipants?: number,
 * }
 * ```
 */

import { HttpError } from "@coops/error";
import * as redis from "@coops/redis";
import { withRedisClient } from "@coops/redis";
import * as logic from "@coops/logic";

import { apiRouter } from "../../../../app/utils/apiRouter";
import { auth } from "../../../../app/utils/auth";
import { isRoomIdQuery } from "../../../../app/utils/queries";

const isRoomBody = (body: unknown): body is Partial<redis.room.types.Room> => {
  return (
    ((body as redis.room.types.Room).title == null ||
      typeof (body as redis.room.types.Room).title === "string") &&
    ((body as redis.room.types.Room).description == null ||
      typeof (body as redis.room.types.Room).description === "string") &&
    ((body as redis.room.types.Room).maximumParticipants == null ||
      typeof (body as redis.room.types.Room).maximumParticipants ===
        "number") &&
    !(
      (body as redis.room.types.Room).title == null &&
      (body as redis.room.types.Room).description == null &&
      (body as redis.room.types.Room).maximumParticipants == null
    )
  );
};

export default apiRouter({
  PUT: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    try {
      const body = JSON.parse(req.body);
      if (!isRoomBody(body)) {
        throw new HttpError(400);
      }
      return withRedisClient(async (client) => {
        await logic.participant.validateHost(client, roomId, authorId);
        await redis.room.CRUD.addRoom(client, roomId, body);
        await logic.room.updateRoom(client, roomId, body);
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new HttpError(400);
      }
      throw error;
    }
  },
});
