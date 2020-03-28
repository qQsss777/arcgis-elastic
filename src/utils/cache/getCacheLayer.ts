import { RedisCache } from '../../cache/Cache';
import { logger } from '../../logger';
import { client } from '../../data';
import { getCacheFeatureSchema } from './getCacheFeatureSchema';
import { IResultsFeaturesData } from '../../interfaces/requests';
import { IFeatureService } from '../../interfaces/esri';
const config = require('../../config');

export const getCacheLayer = async (obj: IResultsFeaturesData): Promise<IFeatureService | any> => {
    logger.info(`Get schema for ${obj.name}.`);
    if (config.redis.support) {
        logger.info(`Cachin enabled ${obj.name}.`);
        //connect to redis db
        const redisCache = new RedisCache();
        const schemaCache = `${obj.name}-layer`;

        //for dev and test only
        redisCache.delete(schemaCache);

        //check if keys and values exist
        const schemaCached = await redisCache.getAsync(schemaCache);

        //if not, get field mapping, set value to redis db and return object with value
        if (!schemaCached) {
            logger.info(`init caching feature layer schema for ${obj.name}.`)
            try {
                //init an Esri GeoJSON
                const layerEsri: IFeatureService = Object.assign(require('../../templates/layer.json'));
                const layer: IFeatureService = JSON.parse(JSON.stringify(layerEsri));
                const schemaFields = await getCacheFeatureSchema({ dataset: obj.name, connection: client });
                layer.name = obj.name;
                layer.fields = schemaFields;
                layer.geometryType = obj.geometry;
                await redisCache.setAsync(schemaCache, JSON.stringify(layer));
                redisCache.end();
                logger.info(`Caching feature layer schema for ${obj.name} finished.`)
                return layer;
            }
            catch (e) {
                logger.error(`Caching feature layer schema for ${obj.name} failed.`)
                throw new Error(e)
            }
        } else {
            redisCache.end();
            return JSON.parse(schemaCached);
        }
    } else {
        try {
            logger.info(`Init getting feature layer schema for ${obj.name}.`);
            //init an Esri GeoJSON
            const layerEsri: IFeatureService = Object.assign(require('../../../templates/layer.json'));
            const layer: IFeatureService = JSON.parse(JSON.stringify(layerEsri));
            const schemaFields = await getCacheFeatureSchema({ dataset: obj.name, connection: client });
            layer.fields = schemaFields;
            layer.geometryType = obj.geometry;
            layer.name = obj.name;
            logger.info(`Getting feature layer schema for ${obj.name} succeed.`);
            return layer;
        }
        catch (e) {
            logger.error(`Getting feature layer schema for ${obj.name} failed : ${e}.`);
            throw new Error(e);
        }
    }
};
