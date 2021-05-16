/**
 * Allow: PUT, DELETE
 *
 * PUT /api/rooms/:room-id/participants/:nickname/microphone
 * DELETE /api/rooms/:room-id/participants/:nickname/microphone
 *
 * 사용자의 마이크를 켜거나 끈 상태로 만듦.
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
import { auth } from "../../../../../../app/utils/auth";
import { isParticipantQuery } from "../../../../../../app/utils/queries";
import { findParticipantByNickname } from "../../../../../../participants/logic/findParticipantByNickname";
import { isHost } from "../../../../../../participants/logic/validateHost";
import { addParticipant } from "../../../../../../participants/redis/CRUD/addParticipant";
import { withRedisClient } from "../../../../../../redis/utils/withRedisClient";

export default apiRouter({
  PUT: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId, nickname } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (redis) => {
      const participant = await findParticipantByNickname(
        redis,
        roomId,
        nickname,
      );
      if (participant == null) {
        throw new HttpError(404);
      }
      let serverMode = false;
      if (participant.participantId !== authorId) {
        if (await isHost(redis, roomId, authorId)) {
          serverMode = true;
        } else {
          throw new HttpError(403);
        }
      }
      if (serverMode) {
        addParticipant(redis, roomId, participant.participantId, {
          mutedAudio: false,
        });
      } else {
        addParticipant(redis, roomId, participant.participantId, {
          muteAudio: false,
        });
      }
    });
  },
  DELETE: async (req, res) => {
    if (!isParticipantQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId, nickname } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (redis) => {
      const participant = await findParticipantByNickname(
        redis,
        roomId,
        nickname,
      );
      if (participant == null) {
        throw new HttpError(404);
      }
      let serverMode = false;
      if (participant.participantId !== authorId) {
        if (await isHost(redis, roomId, authorId)) {
          serverMode = true;
        } else {
          throw new HttpError(403);
        }
      }
      if (serverMode) {
        addParticipant(redis, roomId, participant.participantId, {
          mutedAudio: true,
        });
      } else {
        addParticipant(redis, roomId, participant.participantId, {
          muteAudio: true,
        });
      }
    });
  },
});
