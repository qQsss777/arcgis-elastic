import { ICacheDataResult } from "../../interfaces/requests";
import { IQuery } from "../../interfaces/elastic";
import { removeSpace } from "..";

export const formatBodyGeoJSON = async (q: any): Promise<IQuery> => {
    const values = Object.values(q).toString().replace(",", " ");
    const f = Object.keys(q);
    const queryFormatted = {
        query: {
            multi_match: {
                query: values,
                fields: f
            }
        }
    };
    return queryFormatted;
};

export const formatBodyFeatureLayer = async (q: any, fields?: ICacheDataResult): Promise<any> => {
    const clauseWhere = await formatExpressionrQuery(q, fields);
    let queryFormatted: any = {}

    /*
  queryFormatted = {
      query: {
          bool: {
              must: [clauseWhere]
          }
      }
  }

  */

    // I don't know how to implement bbox for 3d app
    if (Object.keys(q.geometry).length > 0) {
        queryFormatted = {
            query: {
                bool: {
                    must: [clauseWhere],
                    filter: {
                        geo_shape: {
                            [fields.geom[0]]: q.geometry
                        }
                    }
                }
            }
        };
    }
    else if (Object.keys(q.geometry).length == 0 && Object.keys(q.where).length > 0) {
        queryFormatted = {
            query: {
                bool: {
                    must: [clauseWhere]
                }
            }
        }
    }

    return queryFormatted;
}

export const formatExpressionrQuery = async (q: any, fields?: ICacheDataResult): Promise<any> => {
    const { dates, doubles, integers } = fields;
    let clause: any = {}

    if (Object.keys(q.where).length > 0) {
        q.where = removeSpace(q.where);
        //instance object
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
    }
    return clause;
}

/*

"filter": {
                "geo_shape": {
                    "location": {
                        "shape": {
                            "type": "envelope",
                            "coordinates" : [[13.0, 53.0], [14.0, 52.0]]
                        },
                        "relation": "within"
                    }
                }
            }


*/