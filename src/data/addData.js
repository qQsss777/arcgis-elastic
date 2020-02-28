const validateSchema = require("./validateSchema");
const addToEs = require("./addToEs");

const addData = async (params, data) => {
    const dataValidated = await validateSchema(params, data);
    const result = dataValidated.length == 0 ? await addToEs(params, data) : { state: false, data: dataValidated };
    return result;
};

module.exports = addData;