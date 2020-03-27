export const typeOfGeom = async (feature: any, geomfield: string) => {
    let type: string;
    //get geometry value
    const geometry = feature[geomfield];
    //if an object it's a geojson if not it's WKT format
    if (geometry instanceof Object) {
        switch (geometry.type) {
            case "polygon":
                type = "esriGeometryPolygon";
                break;
            case "linestring":
                type = "esriGeometryPolyline";
                break;
            case "multilinestring":
                type = "esriGeometryPolyline";
                break;
            case "point":
                type = "esriGeometryPoint";
                break;
            default:
                throw new Error('type non reconnu')
        }
    } else {
        //get wkt type
        const typeWKT = geometry.split(' (', 1)[0];
        switch (typeWKT) {
            case "POINT":
                type = "esriGeometryPoint";
                break;
            case "MULTIPOLYGON":
                type = "esriGeometryPolygon";
                break;
            case "MULTILINESTRING":
                type = "esriGeometryPolyline";
                break;
            default:
                throw new Error('type non reconnu')
        }
    }
    return type
}
