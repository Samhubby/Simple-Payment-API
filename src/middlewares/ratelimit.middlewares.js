import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";


const createRateLimit = (message) => {
  return rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    max: 5,
    handler: (_, res) => {
      return res
        .status(429)
        .json(
          new ApiError(
            429,
            `You have exceeded your limit for updating ${message}`
          )
        );
    },

    headers: true,
  });
};

export { createRateLimit };
