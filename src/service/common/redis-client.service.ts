import { Injectable } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisClientService {
    private redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            password: process.env.REDIS_PASSWORD
        })
    }

    async cacheOrFetch<T>(key: string, expiresIn: number, fetch: () => Promise<T>): Promise<T> {
        const cached = await this.redisClient.get(key);
        if(cached) {
            return JSON.parse(cached);
        }
        const data = await fetch();
        await this.redisClient.set(key, JSON.stringify(data), {
            EX: expiresIn
        });
        return data;
    }

    get client() {
        return this.redisClient;
    }
}