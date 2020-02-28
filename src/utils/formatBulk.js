const getCacheData = require("../cache/getCacheData");

const formatBulk = async (params, data) => {
    const body = [data].flatMap(doc => [{ index: { _index: params.dataset } }, doc]);
    return body;
};

module.exports = formatBulk;