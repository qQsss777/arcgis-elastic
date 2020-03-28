import { client } from '../connection';
import { formatBulk } from '../../utils';
import { IPostData, IPostResults } from '../../interfaces/requests';
import { logger } from '../../logger';

export const addToEs = async (obj: IPostData): Promise<IPostResults> => {
    logger.info(`Init adding data to ${obj.dataset}.`)
    try {
        const dataToBulk = await formatBulk({ dataset: obj.dataset, data: obj.data });
        const { body } = await client.bulk({
            index: obj.dataset,
            body: dataToBulk
        });

        let results;
        const state = body.errors;

        if (body.errors) {
            logger.info(`Error in adding data to ${obj.dataset}.`)
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
            results = { documents: erroredDocuments };
        } else {
            logger.info(`Success in adding data to ${obj.dataset}.`)
            results = {};
        }
        return { state, data: results };
    }
    catch (e) {
        logger.error(`Adding data to ${obj.dataset} failed : ${e}.`)
        return e.meta ? { state: false, data: e.meta.body.error.type } : { state: false, data: {} };
    }
};