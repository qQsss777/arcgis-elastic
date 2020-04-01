import { logger } from '../../logger';
import { IQuery, IQueryString } from '../../interfaces/elastic';
import { ICacheDataResult } from '../../interfaces/requests';
import { removeSpace } from '../../utils';

export const queryEsModel = async (obj: any, query: object, fields?: ICacheDataResult): Promise<IQuery | IQueryString> => {
    try {
        logger.info(`init formatting query for ES.`);
        let body = {};
        if (Object.entries(query).length !== 0) {
            if (obj.url.includes(`/${obj.dataset}/geojson`)) {
                body = await formatBodyGeoJSON(query)
            } else if (obj.url.includes(`/${obj.dataset}/featureserver/0/query`)) {
                body = await formatBodyFeatureLayer(query, fields)
            } else {
                throw new Error('Routes not allowed')
            }
        }
        logger.info(`formatting query for ES finished.`);
        return body;
    } catch (e) {
        logger.error(`formatting query for ES failed.`);
        throw new Error(e)
    }
};

const formatBodyGeoJSON = async (q: any): Promise<IQuery> => {
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

const formatBodyFeatureLayer = async (q: any, fields?: ICacheDataResult): Promise<IQuery> => {
    const clauseWhere = formatNumberQuery(q, fields);
    const queryFormatted = {
        query: clauseWhere
    };
    return queryFormatted;
};

const formatNumberQuery = (q: any, fields?: ICacheDataResult): any => {
    const { dates, doubles, integers } = fields;
    q.where = removeSpace(q.where);
    //instance object
    let clause: any = {}
    let andor: string = '';

    //define operator;
    const operatorsLiteral = ['AND', 'OR'];

    //split clause where
    const where = q.where.split(" ");
    //each query go with 3 parameters : field, operator, value
    //we need to verify first element if is not a OR or a AND
    while (where.length > 2) {
        const field = where[0];
        const operator = where[1];
        const value = where[2];
        //if the first element is literal, extract it
        if (operatorsLiteral.includes(where[0])) {
            andor = where[0];
            where.splice(0, 1)
        } else {
            //format for numeric or date query
            if (integers.includes(field) || doubles.includes(field) || dates.includes(field)) {
                if (andor === '' && operator === '=') {
                    clause = { multi_match: { query: value, fields: [field] } }
                    break;
                }
                else {
                    if (operator === '<=') {
                        if (andor === '') {
                            clause = { range: { [field]: { lte: value } } }
                        } else {
                            clause.range[field]['lte'] = value;
                            break;
                        }
                    }
                    if (operator === '<') {
                        clause = { range: { [field]: { lt: value } } }
                        if (andor === '') {
                            clause = { range: { field: field, lte: value } }
                        }
                        else {
                            clause.range[field]['lt'] = value;
                            break;
                        }
                    }
                    if (operator === '>') {
                        if (andor === '') {
                            clause = { range: { [field]: { gt: value } } }
                        } else {
                            clause.range[field]['gt'] = value;
                            break;
                        }
                    }
                    if (operator === '=>') {
                        if (andor === '') {
                            clause = { range: { [field]: { gte: value } } }
                        } else {
                            clause.range[field]['gte'] = value;
                            break;
                        }
                    }
                }
            }
            else {
                if (andor === '' && operator === '=') {
                    clause = { multi_match: { query: value, fields: [field] } }
                }
                else if (andor !== '' && operator === '=') {
                    clause.multi_match.fields.push(field);
                    clause.multi_match.value += ` ${value}`;
                }
            }
            where.splice(0, 3);
            andor = ''
        }
    }
    return clause;
}