import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null;

export const startRedis = () => {
  redisClient = createClient({
    url: "redis://:DOCKER@localhost:6380"
  });
};

export const getRedis = async () => {
  if (!redisClient) {
    startRedis();
  }

  if (!redisClient?.isOpen) {
    await redisClient!.connect();
  }

  return redisClient!;
};