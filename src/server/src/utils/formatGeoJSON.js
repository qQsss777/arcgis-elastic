"use strict";

const modelGeoJson = require("./modelGeoJson");

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
const formatEsriGeoJSON = async (source, fields) => {

    //get info for date fields en geometry type
    const { dates, geom } = fields;
    //get data
    const jsonSource = source.map(hit => hit["_source"]);

    //check if there is a geometry
    if (geom.length > 0) {
        //init an Esri GeoJSON
        const esriGeoJSON = {
            type: "FeatureCollection",
            features: [],
            metadata: {}
        };

        //push features to the Esri GeoJSON
        for (let i = 0; i < jsonSource.length; i++) {
            const ft = jsonSource[i];
            const features = await modelGeoJson(ft, geom[0], geom[1], dates);
            esriGeoJSON.features.push(features)
        }
        return esriGeoJSON;
    }
    else {
        return jsonSource;
    }
};

module.exports = formatEsriGeoJSON;


