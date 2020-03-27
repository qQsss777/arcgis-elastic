import { RedisCache } from './Cache';
import { IResultsFeaturesData, IFeatureServer } from '../interfaces';
import { logger } from '../logger';
import { client } from '../data';
import { getCacheFeatureSchema } from './getCacheFeatureSchema';
const config = require('../config');

export const getCacheLayer = async (obj: IResultsFeaturesData): Promise<IFeatureServer | any> => {
    if (config.redis.support) {
        //connect to redis db
        const redisCache = new RedisCache();
        const schemaCache = `${obj.name}-layer`;
        //for dev and test only
        redisCache.delete(schemaCache);

        //check if keys and values exist
        const schemaCached = await redisCache.getAsync(schemaCache);

        //if not, get field mapping, set value to redis db and return object with value
        if (!schemaCached) {
            logger.info(`init caching feature layer schema for ${obj.name} finished`)
            try {
                //init an Esri GeoJSON
                const layerEsri: IFeatureServer = Object.assign(require('../../templates/layer.json'));
                const layer: IFeatureServer = JSON.parse(JSON.stringify(layerEsri));
                const schemaFields = await getCacheFeatureSchema({ dataset: obj.name, connection: client });
                layer.name = obj.name;
                layer.fields = schemaFields;
                layer.geometryType = obj.typeOfGeom;
                await redisCache.setAsync(schemaCache, JSON.stringify(layer));
                redisCache.end();
                logger.info(`caching feature layer schema for ${obj.name} finished`)
                return layer;
            }
            catch (e) {
                logger.error(`caching feature layer schema for ${obj.name} failed`)
                return { state: false, data: e };
            }
        } else {
            redisCache.end();
            return JSON.parse(schemaCached);
        }
    } else {
        try {
            logger.error(`init getting feature layer schema for ${obj.name}`)
            //init an Esri GeoJSON
            const layerEsri: IFeatureServer = Object.assign(require('../../templates/layer.json'));
            const layer: IFeatureServer = JSON.parse(JSON.stringify(layerEsri));
            const schemaFields = await getCacheFeatureSchema({ dataset: obj.name, connection: client })
            layer.fields = schemaFields;
            layer.geometryType = obj.typeOfGeom;
            layer.name = obj.name
            logger.error(`getting feature layer schema for ${obj.name} succeed`)
            return layer;
        }
        catch (e) {
            logger.error(`getting feature layer schema for ${obj.name} failed`)
            console.log(e)
            return { state: false, data: e };
        }
    }
};
