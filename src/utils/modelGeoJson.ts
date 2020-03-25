import * as moment from 'moment';
import { IFeature } from '../interfaces';

export const modelGeoJson = async (feature: any, objectId: string, typeGeom: string, geomField: string, datelist: Array<string>): Promise<any> => {
    //get format for geo_point coordinates
    const coordinates = typeGeom === "geo_point" ? [feature[geomField].lon, feature[geomField].lat] : feature[geomField];
    //get geometry type for geo_point
    const ft = typeGeom === "geo_point" ? await geoPoint(coordinates, feature) : await geoShape(feature, geomField);

    //for each field date, get timestamp value
    for (let i = 0; i < datelist.length; i++) {
        const dateFormat = moment(ft.properties[datelist[i]]).valueOf();
        ft.properties[datelist[i]] = dateFormat;
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

const geoShape = async (feature: any, typeGeom: string): Promise<IFeature> => {
    let type: string;
    switch (feature[typeGeom].type) {
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
    //init an Esri feature json
    const esriFeature: IFeature = {
        type: "Feature",
        geometry: {
            type,
            coordinates: feature[typeGeom].coordinates
        },
        properties: feature
    };
    return esriFeature;
};

