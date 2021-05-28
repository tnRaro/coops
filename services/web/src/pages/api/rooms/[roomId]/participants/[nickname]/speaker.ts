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

import { HttpError } from "@coops/error";
import { withRedisClient } from "@coops/redis";
import * as logic from "@coops/logic";

import { apiRouter } from "../../../../../../app/utils/apiRouter";
import { auth } from "../../../../../../app/utils/auth";
import { isParticipantQuery } from "../../../../../../app/utils/queries";

export default apiRouter({
  PUT: async (req, res) => {
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
      let serverMode = false;
      if (participant.participantId !== authorId) {
        if (await logic.participant.isHost(client, roomId, authorId)) {
          serverMode = true;
        } else {
          throw new HttpError(403);
        }
      }
      if (serverMode) {
        await logic.participant.setParticipant(
          client,
          roomId,
          participant.participantId,
          nickname,
          {
            mutedSpeaker: false,
          },
        );
      } else {
        await logic.participant.setParticipant(
          client,
          roomId,
          participant.participantId,
          nickname,
          {
            muteSpeaker: false,
          },
        );
      }
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
      let serverMode = false;
      if (participant.participantId !== authorId) {
        if (await logic.participant.isHost(client, roomId, authorId)) {
          serverMode = true;
        } else {
          throw new HttpError(403);
        }
      }
      if (serverMode) {
        await logic.participant.setParticipant(
          client,
          roomId,
          participant.participantId,
          nickname,
          {
            mutedSpeaker: true,
          },
        );
      } else {
        await logic.participant.setParticipant(
          client,
          roomId,
          participant.participantId,
          nickname,
          {
            muteSpeaker: true,
          },
        );
      }
    });
  },
});
