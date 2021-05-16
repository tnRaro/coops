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
import { auth } from "../../../../../app/utils/auth";
import { isParticipantQuery } from "../../../../../app/utils/queries";
import { findParticipantByNickname } from "../../../../../participants/logic/findParticipantByNickname";
import { validateHost } from "../../../../../participants/logic/validateHost";
import { addParticipant } from "../../../../../participants/redis/CRUD/addParticipant";
import { withRedisClient } from "../../../../../redis/utils/withRedisClient";

export default apiRouter({
  PUT: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId, nickname } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (redis) => {
      await validateHost(redis, roomId, authorId);
      const participant = await findParticipantByNickname(
        redis,
        roomId,
        nickname,
      );
      if (participant == null) {
        throw new HttpError(404);
      }
      await addParticipant(redis, roomId, authorId, {
        isHost: false,
      });
      await addParticipant(redis, roomId, participant.participantId, {
        isHost: true,
      });
    });
  },
});
