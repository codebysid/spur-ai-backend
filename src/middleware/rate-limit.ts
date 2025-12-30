import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";

export function rateLimiter(
    maxRequests = 30,
    windowSeconds = 60
) {
    return async function (
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const key = `rate:${req.ip}`;
            const count = await redis.incr(key);

            if (count === 1) {
                await redis.expire(key, windowSeconds);
            }

            if (count > maxRequests) {
                return res.status(429).json({
                    error: "Too many requests, please slow down",
                });
            }

            next();
        } catch (err) {
            console.error("Rate limit error", err);
            next(); // fail-open
        }
    };
}
