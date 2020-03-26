import { modelGeoJson } from './modelGeoJson';
import { IResultsData, IFeaturesCollection, IFeature } from '../interfaces';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatEsriGeoJSON = async (obj: IResultsData) => {
    //get info for date fields en geometry type
    const { dates, geom, double, integer } = obj.fields;
    //get data
    const jsonSource = obj.source.map(hit => hit["_source"]);
    const objectIds = obj.source.map(hit => hit["_id"])
    //init an Esri GeoJSON
    const esriGeoJSON: IFeaturesCollection = {
        type: "FeatureCollection",
        features: [],
        metadata: {
            time: dates[0],
            objectID: "objectID"
        }
    };
    //push features to the Esri GeoJSON
    for (let i = 0; i < jsonSource.length; i++) {
        const ft = jsonSource[i];
        const objectId = objectIds[i]
        const features: IFeature = await modelGeoJson(ft, objectId, geom[1], geom[0], dates, integer, double);
        esriGeoJSON.features.push(features);
    }
    return esriGeoJSON;
};

