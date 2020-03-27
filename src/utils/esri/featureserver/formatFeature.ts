import * as moment from 'moment';
import { IFeatureEsri } from '../../../interfaces';
import proj4 = require('proj4');

export const formatFeature = async (
    feature: any,
    objectId: number,
    typeGeom: string,
    geomField: string,
    datelist: Array<string>,
    integerList: Array<string>,
    doubleList: Array<string>): Promise<IFeatureEsri> => {
    try {
        //get format for geo_point coordinates
        const coordinates = typeGeom === "geo_point" ? [feature[geomField].lon, feature[geomField].lat] : feature[geomField];

        //get geometry type for geo_point
        const ft = typeGeom === "geo_point" ? await geoPoint(coordinates, feature) : await geoShape(feature, geomField);

        //for each field date, get timestamp value
        for (let i = 0; i < datelist.length; i++) {
            const dateFormat = moment(ft.attributes[datelist[i]]).valueOf();
            ft.attributes[datelist[i]] = dateFormat;
        }

        //for each field integer, parse the value
        for (let i = 0; i < integerList.length; i++) {
            ft.attributes[integerList[i]] == null ? ft.attributes[integerList[i]] = -1 : ft.attributes[integerList[i]] = parseInt(ft.attributes[integerList[i]])
        }

        //for each field double, parse the value
        for (let i = 0; i < doubleList.length; i++) {
            ft.attributes[doubleList[i]] == null ? ft.attributes[doubleList[i]] = -1 : ft.attributes[doubleList[i]] = parseFloat(ft.attributes[doubleList[i]])

        }
        //ft.properties.GLOBALID = objectId;
        ft.attributes.OBJECTID = objectId;
        return ft;
    } catch (e) {
        console.log(e)
        return e
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

