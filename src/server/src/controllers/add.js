const addData = require("../data/addData");

const postData = async (params, data) => {
    const dataAdded = await addData(params, data);
    return dataAdded;
};

module.exports = postData;