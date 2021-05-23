/* eslint-disable require-atomic-updates */
import { PassThrough } from "stream";

import { HttpError, LogicError, UnauthorizedError } from "@coops/error";
import * as logic from "@coops/logic";
import * as redis from "@coops/redis";
import { getRedisClient } from "@coops/redis";
import cors from "@koa/cors";
import Koa from "koa";

import { HttpResult } from "../../core/dist";

const koa = new Koa();

koa.use(
  cors({
    credentials: true,
  }),
);

koa.use(async (context, next) => {
  const pathReg = /^\/api\/rooms\/([^/]{6})\/stream$/;
  if (!pathReg.test(context.path)) {
    return next();
  }
  const [client, quit] = getRedisClient();
  try {
    const { key } = context.query;
    const [_, roomId] = context.path.match(pathReg)!;
    if (key == null) {
      throw new UnauthorizedError(`Access to the room: ${roomId}`);
    }
    const authorId = key as string;
    if (!(await logic.participant.isParticipant(client, roomId, authorId))) {
      throw new HttpError(403);
    }
    const chatKey = redis.chat.useChatKey(roomId);
    await redis.pubsub.sub(client, chatKey);
    context.request.socket.setTimeout(0);
    context.req.socket.setNoDelay(true);
    context.req.socket.setKeepAlive(true);
    context.set("Content-Type", "text/event-stream");
    context.set("Cache-Control", "no-cache");
    context.set("Connection", "keep-alive");
    const stream = new PassThrough();
    context.status = 200;
    context.body = stream;
    let isRunning = true;
    const say = (message: string, event?: string) => {
      if (!isRunning) {
        return;
      }
      if (event != null) {
        stream.write(`event: ${event}\n`);
      }
      stream.write(`data: ${message}\n\n`);
    };
    client.on("message", (channel, message) => {
      switch (channel) {
        case chatKey: {
          say(message, "chat");
          break;
        }
        default: {
          // eslint-disable-next-line no-console
          console.error(channel, message);
        }
      }
    });
    stream.on("close", () => {
      isRunning = false;
      client.unsubscribe(chatKey, (error, reply) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } else {
          // eslint-disable-next-line no-console
          console.log(reply);
        }
        quit();
      });
    });
  } catch (error: unknown) {
    await quit();
    if (error instanceof LogicError) {
      context.status = error.code;
      context.body = error.message;
    } else if (error instanceof HttpError) {
      if (error instanceof UnauthorizedError) {
        context.set("WWW-Authenticate", error.realm);
      }
      context.status = error.code;
      context.body = error.message;
    } else if (error instanceof HttpResult) {
      // eslint-disable-next-line no-console
      console.error("You should not to throw HttpResult.");
      context.status = 500;
      context.body = "You should not to throw HttpResult.";
    } else {
      // unhandled error
      // eslint-disable-next-line no-console
      console.error(error);
      context.status = 500;
      context.body = String(error);
    }
  }
});

koa.listen(5353);
