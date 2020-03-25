import { IQuery } from '../interfaces';

export const queryEsModel = async (query: object): Promise<IQuery> => {
    const body = Object.entries(query).length === 0 ? {} : await formatBody(query);
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