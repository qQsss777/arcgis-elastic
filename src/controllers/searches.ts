import { ISearch, IResults } from '../interfaces';
import { searchData } from '../data';
import { formatEsriGeoJSON } from '../utils';

export const searches = async (obj: ISearch): Promise<object> => {
    //get data from Elasticsearch
    const { state, data } = await searchData({ dataset: obj.dataset, query: obj.query });
    //if success, format data to esri geojson
    return state ? formatEsriGeoJSON({ fields: data!.fields, source: data!.source }) : {};
};