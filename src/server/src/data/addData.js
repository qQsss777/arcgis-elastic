const validateSchema = require("./validateSchema");
const addToEs = require("./addToEs");

const addData = async (params, data) => {
    const dataValidated = await validateSchema(params, data);
    console.log(dataValidated);
    const result = dataValidated.length == 0 ? await addToEs(params, data) : { state: "failed", data: dataValidated };
    return result;
};

module.exports = addData;