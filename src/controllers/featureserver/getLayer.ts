import { getData } from '../../data';
import { logger } from '../../logger';
import { IFeatureServerSearch } from '../../interfaces/requests';
import { IFeaturesCollection } from '../../interfaces/geojson';
import { IFeatureService } from '../../interfaces/esri';

export const getLayer = async (obj: IFeatureServerSearch): Promise<number | IFeaturesCollection | IFeatureService> => {
    logger.info(`init getting data featureserver for ${obj.dataset}`)
    //get data from Elasticsearch
    return await getData({ dataset: obj.dataset, url: obj.url, query: {} });
};
