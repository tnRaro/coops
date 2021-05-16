import { RedisClient } from "redis";

import { HttpError } from "../../app/errors/HttpError";
import { LogicError } from "../../app/errors/LogicError";

import { getRedisClient } from "./getRedisClient";

export const withRedisClient = async <TResult>(
  callback: (redis: RedisClient) => Promise<TResult>,
) => {
  const [redis, quit] = getRedisClient();
  try {
    // eslint-disable-next-line node/callback-return
    const result = await callback(redis);
    await quit();
    return result;
  } catch (error) {
    await quit();
    if (error instanceof LogicError) {
      throw new HttpError(error.code, error.message);
    }
    throw error;
  }
};
