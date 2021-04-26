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
import { apiRouter } from "../../../../app/utils/apiRouter";

export default apiRouter({
  POST: async (req, res) => {
    throw new HttpError(501);
  },
});
