import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";

export async function concurrencyGuard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const key = `active:${req.ip}`;

    try {
        const active = await redis.get<number>(key);

        if (active && active >= 1) {
            return res.status(429).json({
                error: "Only one active request allowed",
            });
        }

        await redis.set(key, 1);

        const cleanup = async () => {
            await redis.del(key);
        };

        res.on("finish", cleanup);
        res.on("close", cleanup);

        next();
    } catch (err) {
        console.error("Concurrency error", err);
        next(); // fail-open
    }
}
