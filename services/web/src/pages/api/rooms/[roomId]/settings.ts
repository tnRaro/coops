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

export default apiRouter({
  PUT: async (req, res) => {
    throw new HttpError(501);
  },
});
