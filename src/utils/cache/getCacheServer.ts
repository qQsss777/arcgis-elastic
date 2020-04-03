import { RedisCache } from '../../cache/Cache';
import { logger } from '../../logger';
import { client } from '../../data';
import { getCacheFeatureSchema } from './getCacheFeatureSchema';
import { IResultsFeaturesData } from '../../interfaces/requests';
import { IFeatureService } from '../../interfaces/esri';
const config = require('../../config');

export const getCacheServer = async (obj: IResultsFeaturesData): Promise<IFeatureService | any> => {
    logger.info(`Get schema for ${obj.name} server.`);
    if (config.redis.support) {
        logger.info(`Cachin enabled ${obj.name}.`);
        //connect to redis db
        const redisCache = new RedisCache();
        const serverCache = `${obj.name}-server`;

        //for dev and test only
        redisCache.delete(serverCache);

        //check if keys and values exist
        const schemaCached = await redisCache.getAsync(serverCache);

        //if not, get field mapping, set value to redis db and return object with value
        if (!schemaCached) {
            logger.info(`init caching feature server schema for ${obj.name}.`)
            try {
                //init an Esri GeoJSON
                const serverEsri: IFeatureService = Object.assign(require('../../../templates/server.json'));
                const server: IFeatureService = JSON.parse(JSON.stringify(serverEsri));
                await redisCache.setAsync(serverCache, JSON.stringify(server));
                redisCache.end();
                logger.info(`Caching feature server schema for ${obj.name} finished.`)
                return server;
            }
            catch (e) {
                logger.error(`Caching feature server schema for ${obj.name} failed.`)
                throw new Error(e)
            }
        } else {
            redisCache.end();
            return JSON.parse(schemaCached);
        }
    } else {
        try {
            logger.info(`Init getting feature server schema for ${obj.name}.`);
            //init an Esri GeoJSON
            const serverEsri: IFeatureService = Object.assign(require('../../../templates/layer.json'));
            const server: IFeatureService = JSON.parse(JSON.stringify(serverEsri));
            logger.info(`Getting feature server schema for ${obj.name} succeed.`);
            return server;
        }
        catch (e) {
            logger.error(`Getting feature server schema for ${obj.name} failed : ${e}.`);
            throw new Error(e);
        }
    }
};
