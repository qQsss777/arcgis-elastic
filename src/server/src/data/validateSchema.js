"use strict";

const Validator = require("jsonschema").Validator;
const client = require("../data/connection");
const getCacheSchema = require("../cache/getCacheSchema");

const validateSchema = async (params, data) => {
    const v = new Validator();
    const schema = await getCacheSchema(params, client);
    const model = {
        id: "/schemaES",
        properties: schema,
        additionalProperties: false,
        required: Object.keys(schema)
    };
    v.addSchema(model, "/schemaES");
    const results = v.validate(data, model);
    return results.errors;
};

module.exports = validateSchema;