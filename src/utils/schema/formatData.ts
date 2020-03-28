import * as jsonschema from 'jsonschema';
import { formatInput } from '..';
import { IPostData } from '../../interfaces/requests';
import { logger } from '../../logger';

export const formatData = async (obj: IPostData): Promise<object> => {
    logger.info("Init validating schema inputs.")
    try {
        const Validator = jsonschema.Validator;
        const v = new Validator();
        const modelEsri: object = {
            id: "/SchemaEsriGeoJSON",
            type: "object",
            properties: {
                geometry: { type: "object" },
                attributes: { type: "object" }
            },
            additionalProperties: false,
            required: ["geometry", "attributes"]
        };
        v.addSchema(modelEsri, "/SchemaEsriGeoJSON");
        const results = v.validate(obj.data, modelEsri);
        const dataValidated: object = results.errors.length == 0 ? await formatInput({ dataset: obj.dataset, data: obj.data }) : obj.data;
        logger.info("Data formatted.")
        return dataValidated;
    } catch (e) {
        logger.error("Validate schema failed.")
        throw new Error(e)
    }
};