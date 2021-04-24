/**
 * Allow: PUT
 *
 * PUT /api/rooms/:room-id/host/:nickname
 *
 * (방 관리자) 방 관리자를 위임함
 *
 * - success: 200
 * - invalid query: 400
 * - unauthorized user for the room: 401
 * - not a host: 403
 * - no room or no user: 404
 */

import { HttpError } from "../../../../../app/errors/HttpError";
import { apiRouter } from "../../../../../app/utils/apiRouter";

export default apiRouter({
  PUT: async (req, res) => {
    throw new HttpError(501);
  },
});
