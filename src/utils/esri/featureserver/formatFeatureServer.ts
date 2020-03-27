import { getCacheLayer } from '../../../cache';
import { IResultsFeaturesData, IFeatureServer } from '../../../interfaces';
import { typeOfGeom } from '../../schema/typeOfGeom';

/*

TODO mettre le cache a sa place et pas ici

*/

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatFeatureServer = async (obj: IResultsFeaturesData) => {
    let renderer: any;
    let geometry: string;
    const { geom } = obj.fields;
    //get data
    const jsonSource = obj.source.map(hit => hit["_source"])[0];

    geometry = await typeOfGeom(jsonSource, geom[0])

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
            throw new Error('type non reconnu')
    }
    obj.typeOfGeom = geometry;
    const layer: IFeatureServer = await getCacheLayer(obj);
    layer.drawingInfo.renderer = renderer;
    return layer;
};

