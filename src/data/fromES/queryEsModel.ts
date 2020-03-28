import { logger } from '../../logger';
import { IQuery } from '../../interfaces/elastic';

export const queryEsModel = async (query: object): Promise<IQuery> => {
    logger.info(`init formatting query for ES.`);
    const body = Object.entries(query).length === 0 ? {} : await formatBody(query);
    logger.info(`formatting query for ES finished.`);
    return body;
};

const formatBody = async (q: object): Promise<IQuery> => {
    const values = Object.values(q).toString().replace(",", " ");
    const fields = Object.keys(q);
    const queryFormatted = {
        query: {
            multi_match: {
                query: values,
                fields
            }
        }
    };
    return queryFormatted;
};