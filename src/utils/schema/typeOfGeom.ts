export const typeOfGeom = async (feature: any, geomfield: string) => {
    let type: string;
    //get geometry value
    const geometry = feature[geomfield];
    //if an object it's a geojson if not it's WKT format
    if (geometry instanceof Object) {
        switch (geometry.type) {
            case "polygon":
                type = "Polygon";
                break;
            case "linestring":
                type = "Polyline";
                break;
            case "multilinestring":
                type = "Polyline";
                break;
            case "point":
                type = "Point";
                break;
            default:
                throw new Error('type non reconnu')
        }
    } else {
        //get wkt type
        const typeWKT = geometry.split(' (', 1)[0];
        switch (typeWKT) {
            case "POINT":
                type = "Point";
                break;
            case "MULTIPOLYGON":
                type = "Polygon";
                break;
            case "MULTILINESTRING":
                type = "Polyline";
                break;
            default:
                throw new Error('type non reconnu')
        }
    }
    return type
}
