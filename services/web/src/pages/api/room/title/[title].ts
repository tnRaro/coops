/**
 * Allow: POST
 *
 * POST /api/room/title/:room-title
 * 방을 생성함
 * - success: 201
 * - invalid query: 400
 *
 * ```
 * Response Body
 * {
 *   roomId: string
 * }
 * ```
 */

import { HttpResult } from "@coops/core";
import { HttpError } from "@coops/error";
import { withRedisClient } from "@coops/redis";
import * as logic from "@coops/logic";

import { apiRouter } from "../../../../app/utils/apiRouter";
import { isTitleQuery } from "../../../../app/utils/queries";

export default apiRouter({
  POST: async (req, res) => {
    if (!isTitleQuery(req.query)) {
      throw new HttpError(400);
    }
    const { title } = req.query;

    return withRedisClient(async (client) => {
      const roomId = await logic.room.createRoom(client, title);
      return new HttpResult({ roomId }, 201);
    });
  },
});
