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

const isRoomBody = (body: unknown): body is redis.room.types.Room => {
  return (
    typeof (body as redis.room.types.Room).title === "string" &&
    typeof (body as redis.room.types.Room).description === "string" &&
    typeof (body as redis.room.types.Room).maximumParticipants === "number"
  );
};

export default apiRouter({
  PUT: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (client) => {
      const body = JSON.parse(req.body);
      if (!isRoomBody(body)) {
        throw new HttpError(400);
      }
      const { title, description, maximumParticipants } = body;
      await logic.participant.validateHost(client, roomId, authorId);
      await redis.room.CRUD.addRoom(client, roomId, {
        title,
        description,
        maximumParticipants,
      });
    });
  },
});
