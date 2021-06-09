import util from "util";

import { HttpError, LogicError, UnauthorizedError } from "@coops/error";
import * as logic from "@coops/logic";
import * as redis from "@coops/redis";
import { getRedisClient } from "@coops/redis";
import express, { NextFunction } from "express";

import { HttpResult } from "../../core/dist";

const app = express();

app.use("/sse/rooms/:roomId", async (req, res, next) => {
  const roomId = req.params.roomId;
  const [pubsub, quit0] = getRedisClient();
  const [client, quit1] = getRedisClient();
  const quit = () => {
    quit0();
    quit1();
  };
  try {
    const { key } = req.query;
    if (key == null) {
      throw new UnauthorizedError(`Access to the room: ${roomId}`);
    }
    const authorId = key as string;
    if (!(await logic.participant.isParticipant(pubsub, roomId, authorId))) {
      throw new HttpError(403);
    }
    const chatKey = redis.chat.useChatKey(roomId);
    const roomKey = redis.room.keys.useRoomKey(roomId);
    const participantIdKey = redis.participant.keys.useParticipantIdKey(roomId);
    await redis.pubsub.sub(pubsub, chatKey);
    await redis.pubsub.sub(pubsub, roomKey);
    await redis.pubsub.sub(pubsub, participantIdKey);
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
      Connection: "keep-alive",
    });
    res.status(200);
    res.flushHeaders();
    let isRunning = true;
    const say = (message: string, event?: string) => {
      if (!isRunning) {
        return;
      }
      if (event != null) {
        res.write(`event: ${event}\n`);
      }
      res.write(`data: ${message}\n\n`);
    };
    pubsub.on("message", (channel, message) => {
      switch (channel) {
        case chatKey: {
          say(message, "chat");
          break;
        }
        case roomKey: {
          say(message, "room");
          break;
        }
        case participantIdKey: {
          say(message, "participant");
          break;
        }
        default: {
          // eslint-disable-next-line no-console
          console.error(channel, message);
        }
      }
    });
    const [nickname] = await redis.participant.CRUD.findParticipant(
      client,
      roomId,
      authorId,
      "nickname",
    );
    await logic.participant.setParticipant(client, roomId, authorId, nickname, {
      isDisconnected: false,
    });
    res.on("close", async () => {
      isRunning = false;
      await logic.participant.setParticipant(
        client,
        roomId,
        authorId,
        nickname,
        {
          isDisconnected: true,
        },
      );
      const unsubscribe: (key: string) => Promise<string> = util
        .promisify(pubsub.unsubscribe)
        .bind(pubsub);
      await Promise.all(
        [chatKey, roomKey, participantIdKey].map((key) => unsubscribe(key)),
      );
      res.end();
      await quit();
    });
  } catch (error) {
    await quit();
    return next(error);
  }
});

app.use((error: any, req: any, res: any, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  if (error instanceof LogicError) {
    res.status(error.code).send(error.message);
  } else if (error instanceof HttpError) {
    if (error instanceof UnauthorizedError) {
      res.set("WWW-Authenticate", error.realm);
      res.status(error.code).end();
    } else {
      res.status(error.code).send(error.message);
    }
  } else if (error instanceof HttpResult) {
    // eslint-disable-next-line no-console
    console.error("You should not to throw HttpResult.");
    res.status(error.code).send("You should not to throw HttpResult.");
  } else {
    // unhandled error
    // eslint-disable-next-line no-console
    console.error(error);
    res.status(500).send(String(error));
  }
  res.status();
});

app.listen(5353, () => {
  // eslint-disable-next-line no-console
  console.log("app listen :5353");
});
