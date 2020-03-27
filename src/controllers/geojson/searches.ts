import { IGeoJSONSearch } from '../../interfaces';
import { searchData } from '../../data';
import { formatEsriGeoJSON } from '../../utils';
import { logger } from '../../logger';

export const searches = async (obj: IGeoJSONSearch): Promise<any> => {
    //get data from Elasticsearch
    logger.info(`init search for ${obj.dataset}`)
    const { state, data } = await searchData({ dataset: obj.dataset, query: obj.query });
    //if success, format data to esri geojson
    return state ? formatEsriGeoJSON({ fields: data.fields, source: data.source }) : 404;
};