/**
 * Allow: PUT, DELETE
 *
 * PUT /api/rooms/:room-id/participants/:nickname/speaker
 * DELETE /api/rooms/:room-id/participants/:nickname/speaker
 *
 * 사용자의 스피커를 켜거나 끈 상태로 만듦.
 * (방 관리자) 서버 상태 값을 변경함.
 * (방 관리자) 자기 자신의 상태를 변경하는 것은 개인 성태 값을 변경함.
 *
 * - success: 200
 * - invalid query or body: 400
 * - unauthorized user for the room: 401
 * - no room: 404
 */

import { HttpError } from "../../../../../../app/errors/HttpError";
import { apiRouter } from "../../../../../../app/utils/apiRouter";

export default apiRouter({
  PUT: async (req, res) => {
    throw new HttpError(501);
  },
  DELETE: async (req, res) => {
    throw new HttpError(501);
  },
});
