import * as jsonschema from 'jsonschema';
import { client } from '../../data';
import { getCacheSchema } from '../cache';
import { IPostData } from '../../interfaces/requests';
import { logger } from '../../logger';

export const validateSchema = async (obj: IPostData) => {
    try {
        logger.info("Init validating data.")
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
        logger.info("Validating data finished.")
        return results.errors;
    }
    catch (e) {
        logger.info("Validating data failed.")
        throw new Error(e)
    }

};