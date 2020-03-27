import { IFeatureServerSearch } from '../../interfaces';
import { searchData } from '../../data';
import { formatFeatureServer } from '../../utils';
import { logger } from '../../logger';

export const searches = async (obj: IFeatureServerSearch): Promise<any> => {
    logger.info(`init search for ${obj.dataset}`)
    //get data from Elasticsearch
    const { state, data } = await searchData({ dataset: obj.dataset, query: {} });
    //if success, format data to esri geojson
    return state ? formatFeatureServer({ name: obj.dataset, fields: data.fields, source: data.source }) : {};
};