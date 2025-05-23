import Redis from "ioredis";

const redisConfig = {
  port: 6379,
  host: process.env.REDIS_HOST,
  maxRetriesPerRequest: null,
};

const redisConnection = new Redis(redisConfig);

export { redisConnection };
