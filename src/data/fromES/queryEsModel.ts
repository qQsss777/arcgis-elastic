import { logger } from '../../logger';
import { IQuery, IQueryString } from '../../interfaces/elastic';
import { ICacheDataResult } from '../../interfaces/requests';
import { formatBodyFeatureLayer, formatBodyGeoJSON } from '../../utils';

export const queryEsModel = async (obj: any, query: any, fields?: ICacheDataResult): Promise<IQuery | IQueryString> => {
    try {
        logger.info(`init formatting query for ES.`);
        let body = {};
        if (Object.entries(query).length !== 0) {
            if (obj.url.includes(`/${obj.dataset}/geojson`)) {
                body = await formatBodyGeoJSON(query)
            } else if (obj.url.includes(`/${obj.dataset}/FeatureServer/0/query`) || obj.url.includes(`/${obj.dataset}/FeatureServer/0/0/query`)) {
                body = await formatBodyFeatureLayer(query, fields)
            } else {
                throw new Error('Routes not allowed')
            }
        }
        logger.info(`formatting query for ES finished.`);
        return body;
    } catch (e) {
        logger.error(`formatting query for ES failed.`);
        throw new Error(e)
    }
};