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

import { HttpError } from "../../../../app/errors/HttpError";
import { apiRouter } from "../../../../app/utils/apiRouter";
import { auth } from "../../../../app/utils/auth";
import { isRoomIdQuery } from "../../../../app/utils/queries";
import { validateHost } from "../../../../participants/logic/validateHost";
import { withRedisClient } from "../../../../redis/utils/withRedisClient";
import { addRoom } from "../../../../rooms/redis/CRUD";
import { Room } from "../../../../rooms/redis/types";

const isRoomBody = (body: unknown): body is Room => {
  return (
    typeof (body as Room).title === "string" &&
    typeof (body as Room).description === "string" &&
    typeof (body as Room).maximumParticipants === "number"
  );
};

export default apiRouter({
  PUT: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (redis) => {
      const body = JSON.parse(req.body);
      if (!isRoomBody(body)) {
        throw new HttpError(400);
      }
      const { title, description, maximumParticipants } = body;
      await validateHost(redis, roomId, authorId);
      await addRoom(redis, roomId, {
        title,
        description,
        maximumParticipants,
      });
    });
  },
});
