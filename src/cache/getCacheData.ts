import { RedisCache } from './Cache';
import { ICacheData, ICacheDataResult } from '../interfaces';

export const getCacheData = async (obj: ICacheData): Promise<ICacheDataResult> => {
    //connect to redis db
    const redisCache = new RedisCache();

    //format key
    const fieldDate: string = `${obj.dataset}-date`;
    const typeGeometry: string = `${obj.dataset}-geom`;

    //delete method for dev and tests
    //redisCache.delete(fieldDate);
    //redisCache.delete(typeGeometry);

    const dateExists = await redisCache.existsAsync(fieldDate);
    const typeGoemExists = await redisCache.existsAsync(typeGeometry);

    //if not, get field mapping, set value to redis db and return object with value
    if (dateExists === 0 && typeGoemExists === 0) {
        try {
            //get mapping information
            const { body } = await obj.connection.indices.getMapping({ index: obj.dataset });

            //format list fields objects
            const fieldsObjects = body[obj.dataset].mappings.properties;

            //get all date fields and push an array to redis db
            const dateListFields = await getFirstField(fieldsObjects, "date");
            await redisCache.pushAsync(fieldDate, dateListFields);

            //get first type of geometry and push it to redis db
            const geometry = await getGeometry(fieldsObjects);
            await redisCache.pushAsync(typeGeometry, geometry);

            //stop connection
            redisCache.end();
            return { dates: dateListFields, geom: geometry };
        } catch (e) {
            return {}
        }
    } else {
        //stop connection
        const dateCache = await redisCache.rangeAsync(fieldDate, 0, -1);
        const geomCache = await redisCache.rangeAsync(typeGeometry, 0, -1);
        redisCache.end();
        return { dates: dateCache, geom: geomCache };
    }

};

const getFirstField = async (object: object, search: string) => {
    const dateFields = [];
    const data = Object.entries(object);
    for (let i = 0; i < data.length; i++) {
        if (Object.values(data[i][1]).indexOf(search) > -1) {
            dateFields.push(data[i][0]);
        }
    }
    return dateFields;
};

const getGeometry = async (object: object) => {
    const geometries = ["geo_point", "point", "polygon", "polyline"];
    const typeGeometry = [];
    const data = Object.entries(object);
    for (let i = 0; i < data.length; i++) {
        const values = Object.values(data[i][1]).toString();
        if (geometries.includes(values)) {
            typeGeometry.push(data[i][0], values);
            break;
        }
    }
    return typeGeometry;
};
