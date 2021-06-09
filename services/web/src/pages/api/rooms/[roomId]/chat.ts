/**
 * Allow: POST
 *
 * POST /api/rooms/:room-id/chat
 *
 * 메시지를 보냄
 *
 * - success: 201
 * - invalid query or body: 400
 * - unauthorized user for the room: 401
 * - no room: 404
 *
 * ```
 * Request Body
 * {
 *   message: string,
 * }
 * ```
 */

import { HttpResult } from "@coops/core";
import { HttpError } from "@coops/error";
import * as logic from "@coops/logic";
import * as redis from "@coops/redis";
import { withRedisClient } from "@coops/redis";

import { apiRouter } from "../../../../app/utils/apiRouter";
import { auth } from "../../../../app/utils/auth";
import { isRoomIdQuery } from "../../../../app/utils/queries";

export default apiRouter({
  POST: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    const { message } = JSON.parse(req.body) as { message: string };
    if (message.length > 2000) {
      throw new HttpError(400);
    }
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (client) => {
      if (!(await logic.participant.isParticipant(client, roomId, authorId))) {
        throw new HttpError(403);
      }
      await logic.chat.appendChat(client, roomId, message, authorId);
      return new HttpResult(null, 201);
    });
  },
  GET: async (req, res) => {
    if (!isRoomIdQuery(req.query)) {
      throw new HttpError(400);
    }
    const { roomId } = req.query;
    const authorId = auth(req, `Access to the room: ${roomId}`);
    return withRedisClient(async (client) => {
      if (!(await logic.participant.isParticipant(client, roomId, authorId))) {
        throw new HttpError(403);
      }
      const chats = await logic.chat.findAllChats(client, roomId);
      return chats;
    });
  },
});
