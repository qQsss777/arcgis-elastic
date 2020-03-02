import { modelGeoJson } from './modelGeoJson';
import { IResultsData, ISearchResponse, IFeaturesCollection, IFeature } from '../interfaces';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatEsriGeoJSON = async (obj: IResultsData) => {
    //get info for date fields en geometry type
    const { dates, geom } = obj.fields;
    //get data
    const jsonSource = obj.source.map(hit => hit["_source"]);

    //check if there is a geometry
    if (geom!.length > 0) {
        //init an Esri GeoJSON
        const esriGeoJSON: IFeaturesCollection = {
            type: "FeatureCollection",
            features: [],
            metadata: {}
        };

        //push features to the Esri GeoJSON
        for (let i = 0; i < jsonSource.length; i++) {
            const ft = jsonSource[i];
            const features: IFeature = await modelGeoJson(ft, geom[0], geom[1], dates);
            esriGeoJSON.features.push(features);
        }
        return esriGeoJSON;
    }
    else {
        return jsonSource;
    }
};

