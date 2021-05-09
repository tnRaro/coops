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
import { ModelError } from "../../../../app/errors/ModelError";
import { apiRouter } from "../../../../app/utils/apiRouter";
import { HttpResult } from "../../../../app/utils/HttpResult";
import { createRoom } from "../../../../redis/models/rooms";
import { getRedisClient } from "../../../../redis/utils/getRedisClient";

interface Query {
  title: string;
}
const isQuery = (query: unknown): query is Query => {
  if (query == null) {
    return false;
  }
  return typeof (query as Query).title === "string";
};

export default apiRouter({
  POST: async (req, res) => {
    if (!isQuery(req.query)) {
      throw new HttpError(400);
    }
    const [redis, quit] = getRedisClient();
    try {
      const roomId = await createRoom(redis, req.query.title);
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
