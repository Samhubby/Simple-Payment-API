import { redisClient } from "../db/redis.js";
import { ApiError } from "../utils/ApiError.js";

const rateLimiter = (rule) => {
  try {
    const { endpoint, rate_limit } = rule;
    return async (req, res, next) => {
      const ipAddress = req.connection.remoteAddress;
      const redisID = `${endpoint}/${ipAddress}`;

      const request = await redisClient.incr(redisID);
      if (request === 1) await redisClient.expire(redisID, rate_limit.time);
      if (request > rate_limit.limit) {
        return res.status(429).json(new ApiError(429, "Too Many Requests"));
      }
      next();
    };
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ message: new ApiError(error.statusCode, error.message) });
  }
};

export { rateLimiter };
