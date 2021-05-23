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

import { HttpError } from "@coops/error";
import { withRedisClient } from "@coops/redis";
import * as redis from "@coops/redis";
import * as logic from "@coops/logic";

import { apiRouter } from "../../../../../app/utils/apiRouter";
import { auth } from "../../../../../app/utils/auth";
import { isParticipantQuery } from "../../../../../app/utils/queries";

export default apiRouter({
  PUT: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId, nickname } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (client) => {
      await logic.participant.validateHost(client, roomId, authorId);
      const participant = await logic.participant.findParticipantByNickname(
        client,
        roomId,
        nickname,
      );
      if (participant == null) {
        throw new HttpError(404);
      }
      await redis.participant.CRUD.addParticipant(client, roomId, authorId, {
        isHost: false,
      });
      await redis.participant.CRUD.addParticipant(
        client,
        roomId,
        participant.participantId,
        {
          isHost: true,
        },
      );
    });
  },
});
