import { getData } from '../../data';
import { logger } from '../../logger';
import { IDataSearch } from '../../interfaces/requests';
import { IFeaturesCollection } from '../../interfaces/geojson';
import { IFeatureService } from '../../interfaces/esri';

export const getGeoJSON = async (obj: IDataSearch): Promise<IFeaturesCollection | IFeatureService | number> => {
    logger.info(`init getting data for ${obj.dataset}`);
    //get data from Elasticsearch
    return await getData({ dataset: obj.dataset, url: obj.url, query: obj.query });
};