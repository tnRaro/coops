import { PassThrough } from "stream";

import Koa from "koa";
import cors from "@koa/cors";

const koa = new Koa();

koa.use(
  cors({
    credentials: true,
  }),
);

koa.use(async (context, next) => {
  if (context.path !== "/sse") {
    return next();
  }
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

  stream.on("close", () => {
    isRunning = false;
  });

  const say = (message: string, event?: string) => {
    if (!isRunning) {
      return;
    }
    if (event != null) {
      stream.write(`event: ${event}\n`);
    }
    stream.write(`data: ${message}\n\n`);
  };

  setTimeout(() => {
    say("취호격파산!");
    setTimeout(() => {
      say("취호격파산!");
      setTimeout(() => {
        say("취호격파산!", "li dailin");
        stream.end();
      }, 1000);
    }, 1000);
  }, 1000);
});

koa.listen(5353);
