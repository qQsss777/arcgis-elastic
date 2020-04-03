import { getCacheServer } from '../../cache';
import { typeOfGeom } from '../../schema/typeOfGeom';
import { IFeatureService } from '../../../interfaces/esri';
import { IResultsFeaturesData } from '../../../interfaces/requests';
import { logger } from '../../../logger';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatServer = async (obj: IResultsFeaturesData) => {
    try {
        logger.info(`Init formatting json for Feature Server.`);
        let geometry: string;
        const { geom } = obj.fields;
        //get data
        const jsonSource = obj.source.map(hit => hit["_source"])[0];
        //get type of geometry
        geometry = await typeOfGeom(jsonSource, geom[0])
        logger.info(`Add renderer to the definiton for FeatureLayer.`);
        //add renderer definition

        //add geometry to object
        obj.geometry = geometry;

        //get cache layer information
        const server: IFeatureService = await getCacheServer(obj);
        logger.info(`Getting definition ${obj.name} Feature layer finished.`);
        return server;
    } catch (e) {
        logger.error(`Geometry type non recognized for ${obj.name}.`);
        throw new Error(e)
    }
};

