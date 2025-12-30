import { Redis } from "@upstash/redis";
import { setRedisAvailable } from "./redis.status";

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function checkRedisConnection() {
    try {
        await redis.ping();
        console.log("✅ Redis connected");
    } catch (err) {
        console.error("❌ Redis connection failed");
        throw err;
    }
}

export async function initRedis() {
    try {
        await redis.ping();
        setRedisAvailable(true);
        console.log("✅ Redis available");
    } catch (err) {
        setRedisAvailable(false);
        console.warn("⚠️ Redis unavailable — running without Redis features");
    }
}