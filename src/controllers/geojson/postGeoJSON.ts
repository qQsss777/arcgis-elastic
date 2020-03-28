import { addData } from '../../data';
import { IResults, IPostData } from '../../interfaces/requests';

export const postGeoJSON = async (obj: IPostData): Promise<IResults> => {
    return await addData({ dataset: obj.dataset, data: obj.data });
};
