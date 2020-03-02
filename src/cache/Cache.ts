import * as redis from 'redis';
import { promisify } from 'util';
const config = require("../config.json");

export class RedisCache {
    port: number;
    _client: redis.RedisClient;
    static instance: any;

    constructor() {
        RedisCache.instance ? RedisCache.instance : null;
        RedisCache.instance = this;
        this.port = config.redis.port;
        this._client = redis.createClient(this.port);
    }

    async getAsync(key: string): Promise<any> {
        const getAsync = promisify(this._client.get).bind(this._client);
        try {
            const value = await getAsync(key);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    async setAsync(key: string, data: string) {
        const setAsync = promisify(this._client.set).bind(this._client);
        try {
            const value = await setAsync(key, data);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    async pushAsync(key: string, data: Array<any>) {
        const pushAsync = promisify(this._client.lpush).bind(this._client);
        try {
            const value = await pushAsync(key, data);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    async rangeAsync(key: string, start: number, end: number) {
        const rangeAsync = promisify(this._client.lrange).bind(this._client);
        try {
            const value = await rangeAsync(key, start, end);
            return value;
        }
        catch (e) {
            return []
        }
    }

    async existsAsync(key: string) {
        const existsAsync = promisify(this._client.exists.bind(this._client));
        try {
            const value = await existsAsync(key);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    delete(key: string): boolean {
        return this._client.del(key);
    }

    end(): void {
        return this._client.end(true);
    }
}