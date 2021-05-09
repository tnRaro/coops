/**
 * Allow: POST, DELETE
 *
 * POST /api/rooms/:room-id/participants/:nickname
 *
 * 사용자를 생성함
 *
 * - success: 201
 * - invalid query: 400
 * - no room: 404
 * - duplicated nickname: 409
 *
 * ```
 * Response Body
 * {
 *   peerId: string,
 *   apiKey: string
 * }
 * ```
 *
 * DELETE /api/rooms/:room-id/participants/:nickname
 *
 * (방 관리자) 사용자를 강제 퇴장함
 *
 * - success: 200
 * - invalid query: 400
 * - unauthorized user for the room: 401
 * - not a host: 403
 * - no room or no user: 404
 */

import { HttpError } from "../../../../../../app/errors/HttpError";
import { apiRouter } from "../../../../../../app/utils/apiRouter";

export default apiRouter({
  POST: async (req, res) => {
    throw new HttpError(501);
  },
  DELETE: async (req, res) => {
    throw new HttpError(501);
  },
});
