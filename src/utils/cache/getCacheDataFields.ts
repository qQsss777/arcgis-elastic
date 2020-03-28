import { RedisCache } from '../../cache/Cache';
import { logger } from '../../logger';
import { ICacheDataResult, ICacheData } from '../../interfaces/requests';
const config = require('../../config');

export const getCacheDataFields = async (obj: ICacheData): Promise<ICacheDataResult> => {
    //Check if caching capability is enabled.
    if (config.redis.support) {
        logger.info(`Cache enabled for ${obj.dataset}`)
        //connect to redis db
        const redisCache = new RedisCache();

        //format key
        const fieldDate: string = `${obj.dataset}-date`;
        const typeGeometry: string = `${obj.dataset}-geom`;
        const fieldDouble: string = `${obj.dataset}-double`;
        const fieldInteger: string = `${obj.dataset}-integer`;

        //delete method for dev and tests
        //redisCache.delete(fieldDate);
        //redisCache.delete(typeGeometry);
        //redisCache.delete(fieldDouble);
        //redisCache.delete(fieldInteger);

        const typeGoemExists = await redisCache.existsAsync(typeGeometry);

        //if not, get field mapping, set value to redis db and return object with value
        if (typeGoemExists === 0 && config.redis.support) {
            logger.info(`caching in progress for ${obj.dataset}`)
            try {
                //get mapping information
                logger.info(`get mapping informations for ${obj.dataset}`)
                const { body } = await obj.connection.indices.getMapping({ index: obj.dataset });

                //format list fields objects
                const fieldsObjects = body[obj.dataset].mappings.properties;

                //get all date fields and push an array to redis db, polyline and polygon not concerned
                const dateListFields = await getFields(fieldsObjects, "date");
                dateListFields.length !== 0 ? await redisCache.pushAsync(fieldDate, dateListFields) : {};

                //get all double fields and push an array to redis db, polyline and polygon not concerned
                const doubleListFields = await getFields(fieldsObjects, "double");
                doubleListFields.length !== 0 ? await redisCache.pushAsync(fieldDouble, doubleListFields) : {};

                //get all integer fields and push an array to redis db, polyline and polygon not concerned
                const integerListFields = await getFields(fieldsObjects, "integer");
                integerListFields.length !== 0 ? await redisCache.pushAsync(fieldInteger, integerListFields) : {};

                //get first type of geometry and push it to redis db, polyline and polygon not concerned
                const geometry = await getGeometry(fieldsObjects);

                //stop connection
                redisCache.end();
                logger.info(`caching finished ${obj.dataset}`)
                return { dates: dateListFields, geom: geometry, integers: integerListFields, doubles: doubleListFields };
            } catch (e) {
                logger.error(`error caching for ${obj.dataset}`)
                return {}
            }
        } else {
            //stop connection
            const dateCache = await redisCache.rangeAsync(fieldDate, 0, -1);
            const geomCache = await redisCache.rangeAsync(typeGeometry, 0, -1);
            const doubleCache = await redisCache.rangeAsync(fieldDouble, 0, -1);
            const integerCache = await redisCache.rangeAsync(fieldInteger, 0, -1);
            redisCache.end();
            logger.info(`values retrieved for ${obj.dataset} from redis db`)
            return { dates: dateCache, geom: geomCache, integers: integerCache, doubles: doubleCache };
        }
    } else {
        logger.info("cache data disabled")
        try {
            logger.info(`get mapping informations for ${obj.dataset}`)
            //get mapping information
            const { body } = await obj.connection.indices.getMapping({ index: obj.dataset });

            //format list fields objects
            const fieldsObjects = body[obj.dataset].mappings.properties;

            //get all date fields and push an array to redis db, polyline and polygon not concerned
            const dateListFields = await getFields(fieldsObjects, "date");
            //get first type of geometry and push it to redis db, polyline and polygon not concerned
            const geometry = await getGeometry(fieldsObjects);
            //get all double fields and push an array to redis db, polyline and polygon not concerned
            const doubleListFields = await getFields(fieldsObjects, "double");
            //get all integer fields and push an array to redis db, polyline and polygon not concerned
            const integerListFields = await getFields(fieldsObjects, "integer");
            return { dates: dateListFields, geom: geometry, integers: integerListFields, doubles: doubleListFields };
        }
        catch (e) {
            logger.error(`error getting structure data for ${obj.dataset} : ${e.name}`)
            throw new Error(`error getting structure data for ${obj.dataset}`)
        }
    }
};

const getFields = async (object: object, search: string): Promise<Array<string>> => {
    const listFields = [];
    const data = Object.entries(object);
    for (let i = 0; i < data.length; i++) {
        if (Object.values(data[i][1]).indexOf(search) > -1) {
            listFields.push(data[i][0]);
        }
    }
    return listFields;
};

const getGeometry = async (object: object): Promise<Array<string>> => {
    const geometries = ["geo_point", "geo_shape"];
    const infosGeometry = [];
    const data = Object.entries(object);
    for (let i = 0; i < data.length; i++) {
        const values = Object.values(data[i][1]).toString();
        if (geometries.includes(values)) {
            infosGeometry.push(data[i][0], values);
            break;
        }
    }
    return infosGeometry;
};
