import { getCacheLayer } from '../../../cache';
import { IResultsFeaturesData } from '../../../interfaces';
import { typeOfGeom } from '../../schema/typeOfGeom';

//support only the current position given by a smartphone’s Geolocation API => GeoJSON.
export const formatFeatureServer = async (obj: IResultsFeaturesData) => {
    let renderer: any;
    const { geom } = obj.fields;
    //get data
    const jsonSource = obj.source.map(hit => hit["_source"])[0];
    const layer = await getCacheLayer(obj);
    const typeGeom = await typeOfGeom(jsonSource, geom[0])
    switch (typeGeom) {
        case "Point":
            renderer = Object.assign(require('../templates/renderer/pointRenderer.json'))
            break;
        case "Polyline":
            renderer = Object.assign(require('../templates/renderer/lineRenderer.json'))
            break;
        case "Polygon":
            renderer = Object.assign(require('../templates/renderer/polygonRenderer.json'))
            break;
        default:
            throw new Error('type non reconnu')
    }
    layer.drawingInfo.renderer = renderer;
    return layer;
};

