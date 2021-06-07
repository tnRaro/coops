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

import { HttpResult } from "@coops/core";
import { HttpError } from "@coops/error";
import { withRedisClient } from "@coops/redis";
import * as redis from "@coops/redis";
import * as logic from "@coops/logic";

import { apiRouter } from "../../../../../../app/utils/apiRouter";
import { auth } from "../../../../../../app/utils/auth";
import { isParticipantQuery } from "../../../../../../app/utils/queries";

export default apiRouter({
  POST: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId, nickname } = req.query;
    return withRedisClient(async (client) => {
      const participant = await logic.participant.enterParticipant(
        client,
        roomId,
        nickname,
      );
      return new HttpResult(participant, 201);
    });
  },
  DELETE: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId, nickname } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (client) => {
      const participant = await logic.participant.findParticipantByNickname(
        client,
        roomId,
        nickname,
      );
      if (participant == null) {
        throw new HttpError(404);
      }
      if (participant.participantId !== authorId) {
        await logic.participant.validateHost(client, roomId, authorId);
      }
      await logic.participant.removeParticipantById(
        client,
        roomId,
        participant.participantId,
      );
    });
  },
});
