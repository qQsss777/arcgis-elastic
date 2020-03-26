import { addData } from '../../data';
import { IPostData, IResults } from '../../interfaces';

export const postData = async (obj: IPostData): Promise<IResults> => {
    const dataAdded = await addData({ dataset: obj.dataset, data: obj.data });
    return dataAdded;
};
