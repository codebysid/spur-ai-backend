import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests. Please slow down.",
    },
});
