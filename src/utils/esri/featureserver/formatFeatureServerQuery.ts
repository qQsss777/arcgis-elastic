import { formatFeature } from '../geojson/formatFeature';
import { IFeatures, IResultsData } from '../../../interfaces';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatFeatureServerQuery = async (obj: IResultsData) => {
    //get info for date fields en geometry type
    const { dates, geom, double, integer } = obj.fields;
    //get data
    const jsonSource = obj.source.map(hit => hit["_source"]);
    const objectIds = obj.source.map(hit => hit["_id"])

    //init an Esri GeoJSON
    const featuresEsri: IFeatures = Object.assign(require('../templates/feature.json'));
    const features: IFeatures = JSON.parse(JSON.stringify(featuresEsri));

    //push features to the Esri GeoJSON
    for (let i = 0; i < jsonSource.length; i++) {
        const ft = jsonSource[i];
        const objectId = objectIds[i]
        const fts: IFeatures = await formatFeature(ft, objectId, geom[1], geom[0], dates, integer, double);
        features.features.push(fts);
    }
    return features;
};

