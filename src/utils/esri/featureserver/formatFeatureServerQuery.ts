import { formatFeature } from './formatFeature';
import { getCacheLayer } from '../../cache';
import { typeOfGeom } from '../../schema/typeOfGeom';
import { IResultsFeaturesData } from '../../../interfaces/requests';
import { IFeatureService, IFeatureEsri, ILayer } from '../../../interfaces/esri';
import { logger } from '../../../logger';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatFeatureServerQuery = async (obj: IResultsFeaturesData): Promise<ILayer | number> => {
    logger.info(`get mapping informations for ${obj.name}`)
    const jsonSource = obj.source.map(hit => hit["_source"]);
    const featuresEsri: ILayer = Object.assign(require('../../../../templates/features.json'));
    const features: ILayer = JSON.parse(JSON.stringify(featuresEsri));
    if (jsonSource.length > 0) {
        try {
            //get info for date fields en geometry type
            const { dates, geom, doubles, integers } = obj.fields;
            const [fieldGeometry, geometry] = geom;
            const layer: IFeatureService = await getCacheLayer(obj);

            //get data
            const typeGeom = await typeOfGeom(jsonSource[0], geom[0])

            //init an Esri GeoJSON

            features.fields = layer.fields;
            //push features to the Esri GeoJSON
            for (let i = 0; i < jsonSource.length; i++) {
                const feature = jsonSource[i];
                const objectId = i
                const fts: IFeatureEsri = await formatFeature({ feature, objectId, geometry, fieldGeometry, dates, integers, doubles });
                features.features.push(fts);
            }
            features.geometryType = typeGeom;
            logger.info(`Features formatted for ${obj.name} `)
            return features;
        } catch (e) {
            logger.error(`Error to create features for ${obj.name} `)
            throw new Error(e)
        }
    } else {
        return features;
    }
};

