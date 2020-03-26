import * as jsonschema from 'jsonschema';
import { client } from '../../data';
import { getCacheSchema } from '../../cache';
import { IPostData } from '../../interfaces';

export const validateSchema = async (obj: IPostData) => {
    const Validator = jsonschema.Validator;
    const v = new Validator();
    const schema = await getCacheSchema({ dataset: obj.dataset, connection: client });
    const model = {
        id: "/schemaES",
        properties: schema,
        additionalProperties: false,
        required: Object.keys(schema)
    };
    v.addSchema(model, "/schemaES");
    const results = v.validate(obj.data, model);
    return results.errors;
};