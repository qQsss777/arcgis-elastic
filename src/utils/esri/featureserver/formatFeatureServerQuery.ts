import { formatFeature } from './formatFeature';
import { IFeatureEsri, IResultsFeaturesData, IFeatureServer, IFeatures } from '../../../interfaces';
import { getCacheLayer } from '../../../cache';
import { typeOfGeom } from '../../schema/typeOfGeom';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatFeatureServerQuery = async (obj: IResultsFeaturesData) => {
    try {

        //get info for date fields en geometry type
        const { dates, geom, double, integer } = obj.fields;
        const layer: IFeatureServer = await getCacheLayer(obj);

        //get data
        const jsonSource = obj.source.map(hit => hit["_source"]);
        const typeGeom = await typeOfGeom(jsonSource[0], geom[0])

        //init an Esri GeoJSON
        const featuresEsri: IFeatures = Object.assign(require('../../../../templates/features.json'));
        const features: IFeatures = JSON.parse(JSON.stringify(featuresEsri));
        features.fields = layer.fields;
        //push features to the Esri GeoJSON
        for (let i = 0; i < jsonSource.length; i++) {
            const ft = jsonSource[i];
            //const globalid = globalids[i]
            const fts: IFeatureEsri = await formatFeature(ft, i, geom[1], geom[0], dates, integer, double);
            features.features.push(fts);
        }
        features.geometryType = typeGeom;
        return features;

    } catch (e) {
        console.log(e)
    }
};

