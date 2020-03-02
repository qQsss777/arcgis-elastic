import { client } from '../data';
import { formatBulk } from '../utils';
import { IPostData } from '../interfaces';

export const addToEs = async (obj: IPostData) => {
    try {
        const dataToBulk = await formatBulk({ dataset: obj.dataset, data: obj.data });
        const { body } = await client.bulk({
            index: obj.dataset,
            body: dataToBulk
        });
        let results;
        const state = body.errors ? false : true;
        if (body.errors) {
            const erroredDocuments: Array<object> = [];
            body.items.forEach((action: any, i: number) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: body[i * 2],
                        document: body[i * 2 + 1]
                    });
                }
            });
            results = erroredDocuments;
            console.log(results)
        } else {
            results = {};
        }
        return { state, data: results };
    }
    catch (e) {
        return e.meta ? { state: false, data: e.meta.body.error.type } : { state: false, data: {} };
    }
};