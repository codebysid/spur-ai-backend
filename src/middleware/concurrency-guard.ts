import { Request, Response, NextFunction } from "express";

const activeRequests = new Map<string, number>();

export function concurrencyGuard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const key = req.ip;
    if (!key) return res.status(429).json({
        error: "Can't go through concurrency check, IP not found",
    });
    const count = activeRequests.get(key) || 0;

    if (count >= 1) {
        return res.status(429).json({
            error: "Too many concurrent requests from this IP",
        });
    }

    activeRequests.set(key, count + 1);

    res.on("finish", () => {
        activeRequests.set(key, (activeRequests.get(key) || 1) - 1);
    });

    next();
}
