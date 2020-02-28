const moment = require("moment");

const modelPoint = async (feature, typeGeom, geomField, datelist) => {
    //get format for geo_point coordinates
    const coordinates = typeGeom === "geo_point" ? [feature[geomField].lon, feature[geomField].lat] : feature[geomField];

    //get geometry type for geo_point
    const type = typeGeom === "geo_point" ? "Point" : typeGeom.charAt(0).toUpperCase();

    //init an Esri feature json
    const esriFeature = {
        type: "Feature",
        geometry: {
            type,
            coordinates
        },
        properties: feature
    };

    //for each field date, get timestamp value
    for (let i = 0; i < datelist.length; i++) {
        const dateFormat = moment(esriFeature.properties[datelist[i]]).valueOf();
        esriFeature.properties[datelist[i]] = dateFormat;
    }
    return esriFeature;
};

module.exports = modelPoint;