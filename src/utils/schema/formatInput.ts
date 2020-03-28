import { client } from '../../data';
import { getCacheDataFields } from '../cache';
import { IPostData } from '../../interfaces/requests';
import { logger } from '../../logger';
import { createCipher } from 'crypto';

export const formatInput = async (obj: IPostData) => {
    logger.info("init formatting data")
    try {
        const { geom } = await getCacheDataFields({ dataset: obj.dataset, connection: client });
        const dataFormatted = obj.data.attributes;
        switch (geom[1]) {
            case "polyline":
                dataFormatted[geom[0]] = obj.data.geometry.coordinates;
                break;
            case "polygon":
                dataFormatted[geom[0]] = obj.data.geometry.coordinates;
                break;
            default:
                dataFormatted[geom[0]] = [obj.data.geometry.x, obj.data.geometry.y];
        }
        return dataFormatted;
    } catch (e) {
        logger.error("Format data failed.")
        throw new Error(e)
    }
};