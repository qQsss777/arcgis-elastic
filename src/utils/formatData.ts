import * as jsonschema from 'jsonschema';
import { IPostData } from '../interfaces';
import { formatInput } from '../utils';

export const formatData = async (obj: IPostData): Promise<object> => {
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
    return dataValidated;
};