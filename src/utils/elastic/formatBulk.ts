import { IPostData } from "../../interfaces";

export const formatBulk = async (obj: IPostData) => {
    const body = [obj.data].flatMap(doc => [{ index: { _index: obj.dataset } }, doc]);
    return body;
};