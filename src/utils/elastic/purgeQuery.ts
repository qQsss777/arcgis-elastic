import { IQueryWhere } from "../../interfaces/elastic";
import proj4 = require("proj4");

export const purgeQuery = async (query: any): Promise<IQueryWhere> => {
    //first create new query object for ES
    let newQuery: IQueryWhere = {
        where: {},
        geometry: {},
        geometryType: '',
        count: false
    };
    newQuery.count = query.returnCountOnly;
    if (query.where !== '1=1' && query.where) {
        newQuery.where = query.where;
    } else {
        newQuery.where = {};
    }

    if (query.geometryType === 'esriGeometryEnvelope' && Object.keys(newQuery.where).length > 0) {
        newQuery.geometryType = 'envelope';
        try {
            const geometry = JSON.parse(query.geometry)
            const x = proj4('EPSG:3857', 'EPSG:4326', [geometry.xmin, geometry.xmax]);
            const y = proj4('EPSG:3857', 'EPSG:4326', [geometry.ymin, geometry.ymax]);
            const coordinates = [
                [
                    [x[0], y[1]],
                    [x[0], y[0]],
                    [x[1], y[0]],
                    [x[1], y[1]],
                    [x[0], y[1]]
                ]
            ]
            const bbox = {
                shape: {
                    type: "Polygon",
                    coordinates,
                },
                relation: "INTERSECTS"
            }
            newQuery.geometry = bbox
        }
        catch (e) {
        }
    }
    return newQuery;
}