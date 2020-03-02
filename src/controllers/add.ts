import { addData } from '../data';
import { IPostData } from '../interfaces';

export const postData = async (obj: IPostData) => {
    const dataAdded = await addData({ dataset: obj.dataset, data: obj.data });
    return dataAdded;
};
