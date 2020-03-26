import * as moment from 'moment';
import { IFeature } from '../interfaces';

export const modelGeoJson = async (
    feature: any,
    objectId: string,
    typeGeom: string,
    geomField: string,
    datelist: Array<string>,
    integerList: Array<string>,
    doubleList: Array<string>): Promise<any> => {
    //get format for geo_point coordinates
    const coordinates = typeGeom === "geo_point" ? [feature[geomField].lon, feature[geomField].lat] : feature[geomField];

    //get geometry type for geo_point
    const ft = typeGeom === "geo_point" ? await geoPoint(coordinates, feature) : await geoShape(feature, geomField);

    //for each field date, get timestamp value
    for (let i = 0; i < datelist.length; i++) {
        const dateFormat = moment(ft.properties[datelist[i]]).valueOf();
        ft.properties[datelist[i]] = dateFormat;
    }

    //for each field integer, parse the value
    for (let i = 0; i < integerList.length; i++) {
        ft.properties[integerList[i]] == null ? ft.properties[integerList[i]] = -1 : ft.properties[integerList[i]] = parseInt(ft.properties[integerList[i]])
    }

    //for each field double, parse the value
    for (let i = 0; i < doubleList.length; i++) {
        ft.properties[doubleList[i]] == null ? ft.properties[doubleList[i]] = -1 : ft.properties[doubleList[i]] = parseFloat(ft.properties[doubleList[i]])

    }

    ft.properties.objectID = objectId;
    return ft;
};

const geoPoint = async (coordinates: Array<any>, feature: any): Promise<IFeature> => {
    //init an Esri feature json
    const esriFeature: IFeature = {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates
        },
        properties: feature
    };
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
    const esriFeature: IFeature = {
        type: "Feature",
        geometry: {
            type: type,
            coordinates
        },
        properties: feature
    };
    return esriFeature;
};

