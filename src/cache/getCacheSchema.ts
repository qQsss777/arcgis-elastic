import { RedisCache } from './Cache';
import { ICacheData } from '../interfaces';
import { logger } from '../logger';

export const getCacheSchema = async (obj: ICacheData): Promise<any> => {

    //connect to redis db
    const redisCache = new RedisCache();
    const schemaCache = `${obj.dataset}-schema`;

    //for dev and test only
    //redisCache.delete(schemaCache);

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
};

const convertGeoType = async (obj: any): Promise<any> => {
    const typeGeom = ["geo_point", "point", "polyline", "polygon"];
    const typeKeyword = ["keyword", "text", "date"];
    const allowedTypes = "any";
    const schemaValues = Object.values(obj);
    const schemaKeys = Object.keys(obj);
    const schemaUpdated: any = {};

    for (let i = 0; i < schemaValues.length; i++) {
        const key: string = schemaKeys[i];
        const val: any = schemaValues[i];
        const typeOfGoem = typeGeom.includes(val.type) ? val.type : allowedTypes;
        const typeUpdated = typeKeyword.includes(val.type) ? "string" : typeOfGoem;
        schemaUpdated[key] = { type: typeUpdated };
    };
    return schemaUpdated;
};