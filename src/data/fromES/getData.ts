import { client, queryEsModel } from '..';
import { getCacheDataFields } from '../../utils/cache/getCacheDataFields';
import { IDataSearch, ICacheDataResult } from '../../interfaces/requests';
import { IFeaturesCollection } from '../../interfaces/geojson';
import { ISearchResponse } from '../../interfaces/elastic';
import { ApiResponse } from '@elastic/elasticsearch';
import { formatGeoJSON, formatFeatureServer } from '../../utils';
import { logger } from '../../logger';
import { IFeatureService } from '../../interfaces/esri';

export const getData = async (obj: IDataSearch): Promise<IFeaturesCollection | IFeatureService | number> => {
    try {
        //format query to retrieve information from ES (use for get data for geojson and FeatureServer )
        const queryEs = await queryEsModel(obj, obj.query);

        //get data fields (geometry, date) from cache or get it from ES.
        const fields: ICacheDataResult = await getCacheDataFields({ connection: client, dataset: obj.dataset });

        //query ES
        logger.info(`Query for ES.`);
        const response: ApiResponse<ISearchResponse<any>> = await client.search({
            index: obj.dataset,
            body: queryEs,
            size: 10000
        });
        logger.info(`Query for ES finished.`);

        //format response to GeoJSON
        if (obj.url.includes(`/${obj.dataset}/geojson`)) {
            return await formatGeoJSON({ fields: fields, source: response.body.hits.hits });
        } else if (obj.url.includes(`/${obj.dataset}/featureserver/`)) {
            return await formatFeatureServer({ name: obj.dataset, fields: fields, source: response.body.hits.hits });
        }
    }
    catch (e) {
        logger.error(`Query for ES failed.`);
        return 404;
    }
};
