import * as moment from 'moment';
import proj4 = require('proj4');
import { IFeatureEsri } from '../../../interfaces/esri';
import { IInformationsSchema } from '../../../interfaces/geojson';
import { logger } from '../../../logger';

export const formatFeature = async (obj: IInformationsSchema): Promise<IFeatureEsri> => {
    logger.info(`Init formatting feature`)
    try {
        //get format for geo_point coordinates
        const coordinates = obj.geometry === "geo_point" ? [obj.feature[obj.fieldGeometry].lon, obj.feature[obj.fieldGeometry].lat] : obj.feature[obj.fieldGeometry];
        //get geometry type for geo_point
        const ft = obj.geometry === "geo_point" ? await geoPoint(coordinates, obj.feature) : await geoShape(obj.feature, obj.fieldGeometry);

        //for each field date, get timestamp value
        for (let i = 0; i < obj.dates.length; i++) {
            const dateFormat = moment(ft.attributes[obj.dates[i]]).valueOf();
            ft.attributes[obj.dates[i]] = dateFormat;
        }

        //for each field integer, parse the value
        for (let i = 0; i < obj.integers.length; i++) {
            ft.attributes[obj.integers[i]] == null ? ft.attributes[obj.integers[i]] = -1 : ft.attributes[obj.integers[i]] = parseInt(ft.attributes[obj.integers[i]])
        }

        //for each field double, parse the value
        for (let i = 0; i < obj.doubles.length; i++) {
            ft.attributes[obj.doubles[i]] == null ? ft.attributes[obj.doubles[i]] = -1 : ft.attributes[obj.doubles[i]] = parseFloat(ft.attributes[obj.doubles[i]])

        }
        //ft.properties.GLOBALID = objectId;
        ft.attributes.OBJECTID = obj.objectId;
        logger.info(`Formatting feature finished`)
        return ft;
    } catch (e) {
        logger.error(`Formatting feature failed`)
        throw new Error(e);
    }
};

const geoPoint = async (coordinates: Array<any>, feature: any): Promise<IFeatureEsri> => {
    //init an Esri feature json
    const ft: IFeatureEsri = Object.assign(require('../../../../templates/featureEsri.json'))
    const esriFeature: IFeatureEsri = JSON.parse(JSON.stringify(ft));
    esriFeature.geometry.x = coordinates[0];
    esriFeature.geometry.y = coordinates[1];
    esriFeature.attributes = feature;
    return esriFeature;
};

const geoShape = async (feature: any, geomField: string): Promise<IFeatureEsri> => {
    //instance of array for coordinates and type of geometry
    let coordinates: any[] = [];
    let type: string;

    //get geometry value
    const geometry = feature[geomField];
    //if an object it's a geojson if not it's WKT format
    if (geometry instanceof Object) {
        switch (geometry.type) {
            case "polygon":
                type = "rings";
                break;
            case "linestring":
                type = "paths";
                break;
            case "multilinestring":
                type = "paths";
                break;
            default:
                throw new Error('type non reconnu')
        }

        const geometryMercator = geometry.coordinates.map((tab: any[]) => tab.map((coord: number[]) => proj4('EPSG:4326', 'EPSG:3857', coord)))
        coordinates = geometryMercator;
    } else {
        //get wkt type
        const typeWKT = geometry.split(' (', 1)[0];
        switch (typeWKT) {
            case "MULTIPOLYGON":
                type = "rings";
                break;
            case "MULTILINESTRING":
                type = "paths";
                break;
            default:
                throw new Error('type non reconnu')
        }
        // get string coordinates
        const values = geometry.split(typeWKT)[1]

        //remove ( & ) characters
        const leftJson = values.replace(/\(/g, '');
        const rightJson = leftJson.replace(/\)/g, '');
        //split with ', ' to obtain array
        const array = rightJson.split(', ')

        //for each element, create an pair of coordinates
        const arrayOfPoints: any[] = []
        array.forEach((element: any) => {
            //convert each string value to float
            const elstring = element.split(' ');
            const withoutSpace = elstring.filter((e: string) => e !== '');
            const pairsCoords = withoutSpace.map((e: string) => parseFloat(e))
            arrayOfPoints.push(proj4('EPSG:4326', 'EPSG:3857', pairsCoords));
        });
        coordinates.push(arrayOfPoints);
    }

    //init an Esri feature json
    const ft: IFeatureEsri = Object.assign(require('../../../../templates/featureEsri.json'))
    const esriFeature: IFeatureEsri = JSON.parse(JSON.stringify(ft));
    esriFeature.geometry[type] = coordinates;
    esriFeature.attributes = feature;
    return esriFeature;
};

