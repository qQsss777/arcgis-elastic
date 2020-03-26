import { IGeoJSONSearch } from "../../interfaces";
import { searchData } from "../../data";
import { formatFeatureServerQuery } from "../../utils";

export const query = async (obj: IGeoJSONSearch): Promise<any> => {
    //get data from Elasticsearch
    const { state, data } = await searchData({ dataset: obj.dataset, query: obj.query });
    //if success, format data to esri geojson
    return state ? formatFeatureServerQuery({ fields: data.fields, source: data.source }) : {};
};