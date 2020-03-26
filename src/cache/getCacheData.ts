import { RedisCache } from './Cache';
import { ICacheData, ICacheDataResult } from '../interfaces';
import { logger } from '../logger';
const config = require('../config');

export const getCacheData = async (obj: ICacheData): Promise<ICacheDataResult> => {
    if (config.redis.support) {
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
            logger.info("cache data created")
            try {
                //get mapping information
                const { body } = await obj.connection.indices.getMapping({ index: obj.dataset });

                //format list fields objects
                const fieldsObjects = body[obj.dataset].mappings.properties;

                //get all date fields and push an array to redis db, polyline and polygon not concerned
                const dateListFields = await getFields(fieldsObjects, "date");
                dateListFields.length !== 0 ? await redisCache.pushAsync(fieldDate, dateListFields) : null;

                //get all double fields and push an array to redis db, polyline and polygon not concerned
                const doubleListFields = await getFields(fieldsObjects, "double");
                doubleListFields.length !== 0 ? await redisCache.pushAsync(fieldDouble, doubleListFields) : null;

                //get all integer fields and push an array to redis db, polyline and polygon not concerned
                const integerListFields = await getFields(fieldsObjects, "integer");
                integerListFields.length !== 0 ? await redisCache.pushAsync(fieldInteger, integerListFields) : null;

                //get first type of geometry and push it to redis db, polyline and polygon not concerned
                const geometry = await getGeometry(fieldsObjects);

                //stop connection
                redisCache.end();
                return { dates: dateListFields, geom: geometry, integer: integerListFields, double: doubleListFields };
            } catch (e) {
                return {}
            }
        } else {
            //stop connection
            const dateCache = await redisCache.rangeAsync(fieldDate, 0, -1);
            const geomCache = await redisCache.rangeAsync(typeGeometry, 0, -1);
            const doubleCache = await redisCache.rangeAsync(fieldDouble, 0, -1);
            const integerCache = await redisCache.rangeAsync(fieldInteger, 0, -1);
            redisCache.end();
            return { dates: dateCache, geom: geomCache, integer: integerCache, double: doubleCache };
        }
    } else {
        logger.info("cache data disabled")
        try {
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

            return { dates: dateListFields, geom: geometry, integer: integerListFields, double: doubleListFields };
        }
        catch (e) {
            throw new Error('erreur dans la récupération des champs')
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
