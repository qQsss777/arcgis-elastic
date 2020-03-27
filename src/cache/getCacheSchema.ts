import { RedisCache } from './Cache';
import { ICacheData } from '../interfaces';
import { logger } from '../logger';
const config = require('../config');

export const getCacheSchema = async (obj: ICacheData): Promise<any> => {
    if (config.redis.support) {
        //connect to redis db
        const redisCache = new RedisCache();
        const schemaCache = `${obj.dataset}-schema`;

        //for dev and test only
        redisCache.delete(schemaCache);

        //check if keys and values exist
        const schemaCached = await redisCache.getAsync(schemaCache);
        //if not, get field mapping, set value to redis db and return object with value
        if (!schemaCached) {
            logger.info("cache schema created")
            try {
                //get mapping information
                const { body } = await obj.connection.indices.getMapping({ index: obj.dataset });
                const data = body[obj.dataset].mappings.properties;
                const schema = await convertGeoType(data);
                await redisCache.setAsync(schemaCache, JSON.stringify(schema));
                redisCache.end();
                return schema;
            }
            catch (e) {
                console.log(e)
                return { state: false, data: e };
            }
        } else {
            redisCache.end();
            return JSON.parse(schemaCached);
        }
    } else {
        try {
            //get mapping information
            const { body } = await obj.connection.indices.getMapping({ index: obj.dataset });
            const data = body[obj.dataset].mappings.properties;
            const schema = await convertGeoType(data);
            return schema;
        }
        catch (e) {
            console.log(e)
            return { state: false, data: e };
        }
    }
};

const convertGeoType = async (obj: any): Promise<any> => {
    const schemaValues = Object.values(obj);
    const schemaKeys = Object.keys(obj);
    const schemaUpdated: any = {};

    for (let i = 0; i < schemaValues.length; i++) {
        const key: string = schemaKeys[i];
        const val: any = schemaValues[i];
        switch (val.type) {
            case ('integer'):
                schemaUpdated[key] = { type: 'integer' };
                break;
            case ('double'):
                schemaUpdated[key] = { type: 'double' };
                break;
            case ('keyword'):
                schemaUpdated[key] = { type: 'string' };
                break;
            case ('text'):
                schemaUpdated[key] = { type: 'string' };
                break;
            case ('date'):
                schemaUpdated[key] = { type: 'string' };
                break;
            case ('point'):
                schemaUpdated[key] = { type: 'point' };
                break;
            default:
                schemaUpdated[key] = { type: 'any' };
        }
    };
    return schemaUpdated;
};