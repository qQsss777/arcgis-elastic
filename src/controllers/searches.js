const searchData = require("../data/searchData");
const formatEsriGeoJSON = require("../utils/formatGeoJSON");

const searches = async (params, query) => {
    //get data from Elasticsearch
    const { state, data } = await searchData(params, query);
    const { source, fields } = data;
    //if success, format data to esri geojson
    return state ? formatEsriGeoJSON(source, fields) : source;
};

module.exports = searches;