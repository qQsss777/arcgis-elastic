import { client, queryEsModel } from '../index';
import { getCacheDataFields } from '../../utils/cache/getCacheDataFields';
import { ApiResponse } from '@elastic/elasticsearch';
import { IDataSearch } from '../../interfaces/requests';
import { ISearchResponse } from '../../interfaces/elastic';
import { formatFeatureServerQuery } from '../../utils';
import { ILayer } from '../../interfaces/esri';
import { logger } from '../../logger';
import { purgeQuery } from './purgeQuery';

export const queryFeatureData = async (obj: IDataSearch): Promise<ILayer | number> => {
    logger.info(`Configure parameters query for ${obj.dataset} feature layer`)
    try {
        const fields = await getCacheDataFields({ connection: client, dataset: obj.dataset });
        const params = await purgeQuery(obj.query)
        const queryEs = await queryEsModel(obj, params, fields);
        const response: ApiResponse<ISearchResponse<any>> = await client.search({
            index: obj.dataset,
            body: queryEs,
            size: 10000
        });
        logger.info(`Getting data from ES for ${obj.dataset} finished.`)
        return await formatFeatureServerQuery({ fields: fields, source: response.body.hits.hits, name: obj.dataset })
    }
    catch (e) {
        logger.info(`Error in getting data from ES for ${obj.dataset} :  ${e}.`)
        return 404;
    }
};
