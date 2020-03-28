import { formatFeature } from './formatFeatureGeoJSON';
import { logger } from '../../../logger';
import { IFeaturesCollection, IFeature } from '../../../interfaces/geojson';
import { IResultsData } from '../../../interfaces/requests';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatGeoJSON = async (obj: IResultsData): Promise<IFeaturesCollection> => {
    logger.info(`Init formatting data for GeoJSON.`);
    try {
        //get info for date fields en geometry type
        const { dates, geom, doubles, integers } = obj.fields;
        const [fieldGeometry, geometry] = geom;

        //get data
        const jsonSource = obj.source.map(hit => hit["_source"]);
        const objectIds = obj.source.map(hit => hit["_id"])

        //init an Esri GeoJSON
        const geoJSON: IFeaturesCollection = Object.assign(require('../../../../templates/geojson.json'))
        const esriGeoJSON: IFeaturesCollection = JSON.parse(JSON.stringify(geoJSON));

        //push features to the Esri GeoJSON
        for (let i = 0; i < jsonSource.length; i++) {
            const feature = jsonSource[i];
            const objectId = objectIds[i]
            const ft: IFeature = await formatFeature({ feature, objectId, geometry, fieldGeometry, dates, integers, doubles });
            esriGeoJSON.features.push(ft);
        }
        logger.info(`Format data for GeoJSON finished.`);
        return esriGeoJSON;
    } catch (e) {
        logger.error(`Format data for GeoJSON failed : ${e}.`);
        throw new Error(e)
    }
};

