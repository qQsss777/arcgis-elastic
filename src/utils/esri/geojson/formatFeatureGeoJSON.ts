import * as moment from 'moment';
import { logger } from '../../../logger';
import { IInformationsSchema, IFeature } from '../../../interfaces/geojson';

export const formatFeature = async (infos: IInformationsSchema): Promise<IFeature> => {
    logger.info(`Init formatting data for GeoJSON feature.`);
    try {
        //get format for geo_point coordinates
        const coordinates = infos.geometry === "geo_point" ? [infos.feature[infos.fieldGeometry].lon, infos.feature[infos.fieldGeometry].lat] : infos.feature[infos.fieldGeometry];

        //get geometry type for geo_point
        const ft = infos.geometry === "geo_point" ? await geoPoint(coordinates, infos.feature) : await geoShape(infos.feature, infos.fieldGeometry);

        //for each field date, get timestamp value
        for (let i = 0; i < infos.dates.length; i++) {
            const dateFormat = moment(ft.properties[infos.dates[i]]).valueOf();
            ft.properties[infos.dates[i]] = dateFormat;
        }

        //for each field integer, parse the value
        for (let i = 0; i < infos.integers.length; i++) {
            ft.properties[infos.integers[i]] == null ? ft.properties[infos.integers[i]] = -1 : ft.properties[infos.integers[i]] = parseInt(ft.properties[infos.integers[i]])
        }

        //for each field double, parse the value
        for (let i = 0; i < infos.doubles.length; i++) {
            ft.properties[infos.doubles[i]] == null ? ft.properties[infos.doubles[i]] = -1 : ft.properties[infos.doubles[i]] = parseFloat(ft.properties[infos.doubles[i]])
        }

        ft.properties.OBJECTID = infos.objectId;
        logger.error(`Format data for GeoJSON feature finished.`);
        return ft;
    } catch (e) {
        logger.error(`Format data for GeoJSON feature failed : ${e}.`);
        throw new Error(e)
    }
};

const geoPoint = async (coordinates: Array<any>, feature: any): Promise<IFeature> => {
    //init an Esri feature json
    const ft: IFeature = Object.assign(require('../../../templates/featureGeojson.json'))
    const esriFeature: IFeature = JSON.parse(JSON.stringify(ft));
    esriFeature.geometry.type = "Point";
    esriFeature.geometry.coordinates = coordinates;
    esriFeature.properties = feature;
    return esriFeature;
};

const geoShape = async (feature: any, geomField: string): Promise<IFeature> => {
    //instance of array for coordinates and type of geometry
    let coordinates: any[] = [];
    let type: string;

    //get geometry value
    const geometry = feature[geomField];
    //if an object it's a geojson if not it's WKT format
    if (geometry instanceof Object) {
        switch (geometry.type) {
            case "polygon":
                type = "Polygon";
                break;
            case "linestring":
                type = "LineString";
                break;
            case "multilinestring":
                type = "LineString";
                break;
            default:
                throw new Error('type non reconnu')
        }
        coordinates = geometry.coordinates
    } else {
        //get wkt type
        const typeWKT = geometry.split(' (', 1)[0];
        switch (typeWKT) {
            case "MULTIPOLYGON":
                type = "Polygon";
                break;
            case "MULTILINESTRING":
                type = "MultiLineString";
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
            arrayOfPoints.push(withoutSpace.map((e: string) => parseFloat(e)));
        });
        coordinates.push(arrayOfPoints);
    }

    //init an Esri feature json
    const ft: IFeature = Object.assign(require('../../../../templates/featureGeojson.json'))
    const esriFeature: IFeature = JSON.parse(JSON.stringify(ft));
    esriFeature.geometry.type = type;
    esriFeature.geometry.coordinates = coordinates;
    esriFeature.properties = feature;
    return esriFeature;
};

