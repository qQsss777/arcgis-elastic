import { client, queryEsModel } from './index';
import { getCacheData } from '../cache/getCacheData';
import { ISearch, IResults, ISearchResponse } from '../interfaces';
import { ApiResponse } from '@elastic/elasticsearch';

export const searchData = async (obj: ISearch): Promise<IResults> => {
    const queryEs = await queryEsModel(obj.query);
    try {
        const fields = await getCacheData({ connection: client, dataset: obj.dataset });
        const response: ApiResponse<ISearchResponse<any>> = await client.search({
            index: obj.dataset,
            body: queryEs,
            size: 10
        });
        return { state: true, data: { fields: fields, source: response.body.hits.hits } };
    }
    catch (e) {
        return { state: false };
    }
};
