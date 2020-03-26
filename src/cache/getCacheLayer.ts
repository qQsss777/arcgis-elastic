import { RedisCache } from './Cache';
import { IResultsFeaturesData, IFeatureServer } from '../interfaces';
import { logger } from '../logger';
const config = require('../config');

export const getCacheLayer = async (obj: IResultsFeaturesData): Promise<any> => {
    if (config.redis.support) {
        //connect to redis db
        const redisCache = new RedisCache();
        const schemaCache = `${obj.name}-layer`;

        //for dev and test only
        //redisCache.delete(schemaCache);

        //check if keys and values exist
        const schemaCached = await redisCache.getAsync(schemaCache);

        //check type of geom

        //if not, get field mapping, set value to redis db and return object with value
        if (!schemaCached) {
            logger.info("cache schema created")
            try {
                //init an Esri GeoJSON
                const layerEsri: IFeatureServer = Object.assign(require('../utils/esri/templates/layer.json'));
                const layer: IFeatureServer = JSON.parse(JSON.stringify(layerEsri));
                layer.name = obj.name
                await redisCache.setAsync(schemaCache, JSON.stringify(layer));
                redisCache.end();
                return layer;
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
            //init an Esri GeoJSON
            const layerEsri: IFeatureServer = Object.assign(require('../utils/esri/templates/layer.json'));
            const layer: IFeatureServer = JSON.parse(JSON.stringify(layerEsri));
            layer.name = obj.name
            return layer;
        }
        catch (e) {
            console.log(e)
            return { state: false, data: e };
        }
    }
};
