import { client, queryEsModel } from '../index';
import { getCacheDataFields } from '../../utils/cache/getCacheDataFields';
import { ApiResponse } from '@elastic/elasticsearch';
import { IDataSearch } from '../../interfaces/requests';
import { ISearchResponse } from '../../interfaces/elastic';
import { formatFeatureServerQuery } from '../../utils';
import { ILayer } from '../../interfaces/esri';
import { logger } from '../../logger';

export const queryFeatureData = async (obj: IDataSearch): Promise<ILayer | number> => {
    logger.info(`Configure parameters query for ${obj.dataset} feature layer`)
    try {
        //first delete useless params
        obj.query.f ? delete obj.query.f : null;
        obj.query.maxRecordCountFactor ? delete obj.query.maxRecordCountFactor : null;
        obj.query.projection || obj.query.returnGeometry === false ? delete obj.query.outSR : null
        obj.query.geometry ? delete obj.query.geometry : null
        obj.query.where === '1=1' ? delete obj.query.where : null
        obj.query.offset ? delete obj.query.resultOffset : null
        if (obj.query.limit) {
            delete obj.query.resultRecordCount
            delete obj.query.limit
        }
        //console.log(obj.query)
        //const queryEs = await queryEsModel(obj.query);

        const fields = await getCacheDataFields({ connection: client, dataset: obj.dataset });
        const response: ApiResponse<ISearchResponse<any>> = await client.search({
            index: obj.dataset,
            body: {},
            size: 2
        });
        logger.info(`Getting data from ES for ${obj.dataset} finished.`)
        return await formatFeatureServerQuery({ fields: fields, source: response.body.hits.hits, name: obj.dataset })
    }
    catch (e) {
        logger.info(`Error in getting data from ES for ${obj.dataset} :  ${e}.`)
        return 404;
    }
};
