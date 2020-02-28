const client = require("./connection");
const formatBulk = require("../utils/formatBulk");
const addToEs = async (params, data) => {
    try {
        const dataToBulk = await formatBulk(params, data, client);
        const { body } = await client.bulk({
            index: params.dataset,
            body: dataToBulk
        });
        let results;
        const state = body.errors ? false : true;
        if (body.errors) {
            const erroredDocuments = [];
            body.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: body[i * 2],
                        document: body[i * 2 + 1]
                    });
                }
            });
            results = erroredDocuments;
        } else {
            results = {};
        }
        return { state, data: results };
    }
    catch (e) {
        return e.meta ? { state: false, data: e.meta.body.error.type } : { state: false, data: {} };
    }
};

module.exports = addToEs;