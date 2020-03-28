import { queryFeatureData } from "../../data";
import { logger } from "../../logger";
import { IDataSearch } from "../../interfaces/requests";
import { ILayer } from "../../interfaces/esri";

export const getLayerData = async (obj: IDataSearch): Promise<ILayer | number> => {
    logger.info(`init query for ${obj.dataset} fearure layer`)
    //get data from Elasticsearch
    return await queryFeatureData({ dataset: obj.dataset, url: obj.url, query: obj.query });
};