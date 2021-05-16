/**
 * Allow: POST
 *
 * POST /api/room/title/:room-title
 * 방을 생성함
 * - success: 201
 * - invalid query: 400
 *
 * ```
 * Response Body
 * {
 *   roomId: string
 * }
 * ```
 */

import { HttpError } from "../../../../app/errors/HttpError";
import { LogicError } from "../../../../app/errors/LogicError";
import { apiRouter } from "../../../../app/utils/apiRouter";
import { HttpResult } from "../../../../app/utils/HttpResult";
import { isTitleQuery } from "../../../../app/utils/queries";
import { getRedisClient } from "../../../../redis/utils/getRedisClient";
import { withRedisClient } from "../../../../redis/utils/withRedisClient";
import { createRoom } from "../../../../rooms/logic/createRoom";

export default apiRouter({
  POST: async (req, res) => {
    if (!isTitleQuery(req.query)) {
      throw new HttpError(400);
    }
    const { title } = req.query;

    return withRedisClient(async (redis) => {
      const roomId = await createRoom(redis, title);
      return new HttpResult({ roomId }, 201);
    });
  },
});
