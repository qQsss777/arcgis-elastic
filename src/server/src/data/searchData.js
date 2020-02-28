const client = require("./connection");
const getCacheData = require("../cache/getCacheData");
const queryEsModel = require("./queryEsModel");

const searchData = async (params, query) => {
    const queryEs = await queryEsModel(query);
    try {
        const fields = await getCacheData(params, client);
        const { body } = await client.search({
            index: params.dataset,
            body: queryEs,
            size: 10
        });
        return { state: "succeed", data: { fields: fields, source: body.hits.hits } };
    }
    catch (e) {
        return e.meta ? { state: "failed", data: e.meta.body.error.type } : { state: "failed", data: {} };
    }
};

module.exports = searchData;