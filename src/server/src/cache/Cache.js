"use strict";
const redis = require("redis");
const promisify = require("util").promisify;
const config = require("../config.json")

class RedisCache {
    constructor() {
        RedisCache.instance ? RedisCache.instance : null;
        RedisCache.instance = this;
        this.port = config.redis.port;
        this._client = redis.createClient(this.port);
    }

    async getAsync(key) {
        const getAsync = promisify(this._client.get).bind(this._client);
        try {
            const value = await getAsync(key);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    async setAsync(key, data) {
        const setAsync = promisify(this._client.set).bind(this._client);
        try {
            const value = await setAsync(key, data);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    async pushAsync(key, data) {
        const pushAsync = promisify(this._client.lpush).bind(this._client);
        try {
            const value = await pushAsync(key, data);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    async rangeAsync(key, start, end) {
        const rangeAsync = promisify(this._client.lrange).bind(this._client);
        try {
            const value = await rangeAsync(key, start, end);
            return value;
        }
        catch (e) {
            console.log(e);
        }
    }

    delete(key) {
        return this._client.del(key);
    }

    end() {
        return this._client.end(true);
    }
}

module.exports = RedisCache;