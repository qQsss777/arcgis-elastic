import { IGeoJSONSearch } from "../../interfaces";
import { queryFeatureData } from "../../data";
import { formatFeatureServerQuery } from "../../utils";
import { logger } from "../../logger";

export const query = async (obj: IGeoJSONSearch): Promise<any> => {
    logger.info(`init query for ${obj.dataset}`)
    //get data from Elasticsearch
    const { state, data } = await queryFeatureData({ dataset: obj.dataset, query: obj.query });
    //if success, format data to esri geojson
    return state ? formatFeatureServerQuery({ fields: data.fields, source: data.source, name: obj.dataset }) : {};
};