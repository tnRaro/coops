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
import { auth } from "../../../../../../app/utils/auth";
import { HttpResult } from "../../../../../../app/utils/HttpResult";
import { isParticipantQuery } from "../../../../../../app/utils/queries";
import { enterParticipant } from "../../../../../../participants/logic/enterParticipant";
import { removeParticipantById } from "../../../../../../participants/logic/removeParticipantById";
import { validateHost } from "../../../../../../participants/logic/validateHost";
import { findAllParticipantIds } from "../../../../../../participants/redis/CRUD/findAllParticipantIds";
import { findParticipant } from "../../../../../../participants/redis/CRUD/findParticipant";
import { withRedisClient } from "../../../../../../redis/utils/withRedisClient";

export default apiRouter({
  POST: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId, nickname } = req.query;
    return withRedisClient(async (redis) => {
      const participant = await enterParticipant(redis, roomId, nickname);
      return new HttpResult(participant, 201);
    });
  },
  DELETE: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (redis) => {
      await validateHost(redis, roomId, authorId);
      const participantIds = await findAllParticipantIds(redis, roomId);
      for (const participantId of participantIds) {
        const [nickname] = await findParticipant(
          redis,
          roomId,
          participantId,
          "nickname",
        );
        if (nickname === req.query.nickname) {
          await removeParticipantById(redis, roomId, participantId);
          break;
        }
      }
    });
  },
});
