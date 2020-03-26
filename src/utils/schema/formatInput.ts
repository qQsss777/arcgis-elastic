import { client } from '../../data';
import { getCacheData } from '../../cache';
import { IPostData } from '../../interfaces';

export const formatInput = async (obj: IPostData) => {
    const { geom } = await getCacheData({ dataset: obj.dataset, connection: client });
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
};