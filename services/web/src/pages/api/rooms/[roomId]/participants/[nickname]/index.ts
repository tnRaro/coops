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
import { ModelError } from "../../../../../../app/errors/ModelError";
import { apiRouter } from "../../../../../../app/utils/apiRouter";
import { HttpResult } from "../../../../../../app/utils/HttpResult";
import { enterParticipantAtRoom } from "../../../../../../redis/models/participants";
import { getRedisClient } from "../../../../../../redis/utils/getRedisClient";

interface Query {
  roomId: string;
  nickname: string;
}
const isQuery = (query: unknown): query is Query => {
  if (query == null) {
    return false;
  }
  return (
    typeof (query as Query).roomId === "string" &&
    typeof (query as Query).nickname === "string"
  );
};
export default apiRouter({
  POST: async (req, res) => {
    if (!isQuery(req.query)) {
      throw new HttpError(400);
    }
    const [redis, quit] = getRedisClient();
    try {
      const participant = await enterParticipantAtRoom(
        redis,
        req.query.roomId,
        req.query.nickname,
      );
      await quit();
      return new HttpResult(participant, 201);
    } catch (error) {
      await quit();
      if (error instanceof ModelError) {
        throw new HttpError(error.code, error.message);
      }
      throw error;
    }
  },
  DELETE: async (req, res) => {
    throw new HttpError(501);
  },
});
