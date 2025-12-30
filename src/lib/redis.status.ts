let redisAvailable = false;

export function setRedisAvailable(value: boolean) {
    redisAvailable = value;
}

export function isRedisAvailable() {
    return redisAvailable;
}
