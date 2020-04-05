import { client, queryEsModel } from '../index';
import { getCacheDataFields } from '../../utils/cache/getCacheDataFields';
import { ApiResponse } from '@elastic/elasticsearch';
import { IDataSearch } from '../../interfaces/requests';
import { ISearchResponse } from '../../interfaces/elastic';
import { formatFeatureServerQuery } from '../../utils';
import { ILayer } from '../../interfaces/esri';
import { logger } from '../../logger';
import { purgeQuery } from '../../utils';

export const queryFeatureData = async (obj: IDataSearch): Promise<ILayer | any> => {
    logger.info(`Configure parameters query for ${obj.dataset} feature layer`)
    try {
        const fields = await getCacheDataFields({ connection: client, dataset: obj.dataset });
        const params = await purgeQuery(obj.query)
        const queryEs = await queryEsModel(obj, params, fields);
        if (!params.count) {
            const response: ApiResponse<ISearchResponse<any>> = await client.search({
                index: obj.dataset,
                body: queryEs,
                size: 10000
            });
            logger.info(`Getting data from ES for ${obj.dataset} finished.`)
            return await formatFeatureServerQuery({ fields: fields, source: response.body.hits.hits, name: obj.dataset })
        } else {
            const count: ApiResponse<any> = await client.count({
                index: obj.dataset,
                body: queryEs
            });
            logger.info(`Getting count data from ES for ${obj.dataset} finished.`)
            return { count: count.body.count }
        }
    }
    catch (e) {
        logger.info(`Error in getting data from ES for ${obj.dataset} :  ${e}.`)
        return 404;
    }
};
