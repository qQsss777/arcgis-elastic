import { client, queryEsModel } from './index';
import { getCacheData } from '../cache/getCacheData';
import { IGeoJSONSearch, IResults, ISearchResponse } from '../interfaces';
import { ApiResponse } from '@elastic/elasticsearch';

export const queryFeatureData = async (obj: IGeoJSONSearch): Promise<IResults> => {
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
    try {
        const fields = await getCacheData({ connection: client, dataset: obj.dataset });
        const response: ApiResponse<ISearchResponse<any>> = await client.search({
            index: obj.dataset,
            body: {},
            size: 1000
        });
        return { state: true, data: { fields: fields, source: response.body.hits.hits } };
    }
    catch (e) {
        console.log(e)
        return { state: false };
    }
};
