import * as util from "util";

import * as redis from "redis";

export const getRedisClient = () => {
  const client = redis.createClient({
    host: "redis",
  });
  type Quit = () => Promise<"OK">;
  const quit: Quit = util.promisify(client.quit).bind(client);
  const errorHandler = (error: any) => {
    // eslint-disable-next-line no-console
    console.error(error);
    client.off("error", errorHandler);
    client.end(true);
  };
  client.on("error", errorHandler);
  return [client, quit] as const;
};
