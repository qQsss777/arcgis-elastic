import { getCacheLayer } from '../../cache';
import { typeOfGeom } from '../../schema/typeOfGeom';
import { IFeatureService } from '../../../interfaces/esri';
import { IResultsFeaturesData } from '../../../interfaces/requests';
import { logger } from '../../../logger';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatFeatureServer = async (obj: IResultsFeaturesData) => {
    try {
        logger.info(`Init formatting json for FeatureLayer.`);
        let renderer: any;
        let geometry: string;
        const { geom } = obj.fields;
        //get data
        const jsonSource = obj.source.map(hit => hit["_source"])[0];
        //get type of geometry
        geometry = await typeOfGeom(jsonSource, geom[0])
        logger.info(`Add renderer to the definiton for FeatureLayer.`);
        //add renderer definition
        switch (geometry) {
            case "esriGeometryPoint":
                renderer = Object.assign(require('../../../../templates/renderer/pointRenderer.json'));
                break;
            case "esriGeometryPolyline":
                renderer = Object.assign(require('../../../../templates/renderer/lineRenderer.json'));
                break;
            case "esriGeometryPolygon":
                renderer = Object.assign(require('../../../../templates/renderer/polygonRenderer.json'));
                break;
            default:
                logger.error(`Geometry type non recognized for ${obj.name}.`);
                throw new Error(`Type non recognized for ${obj.name}.`)
        }

        //add geometry to object
        obj.geometry = geometry;

        //get cache layer information
        const layer: IFeatureService = await getCacheLayer(obj);
        layer.drawingInfo.renderer = renderer;
        logger.info(`Getting definition ${obj.name} Feature layer finished.`);
        return layer;
    } catch (e) {
        logger.error(`Geometry type non recognized for ${obj.name}.`);
        throw new Error(e)
    }
};

