export const purgeQuery = async (query: any): Promise<any> => {
    //first delete useless params
    query.f ? delete query.f : null;
    query.maxAllowableOffset ? delete query.maxAllowableOffset : null;
    query.outFields ? delete query.outFields : null;
    query.inSR ? delete query.inSR : null;
    query.returnExceededLimitFeatures ? delete query.returnExceededLimitFeatures : null;
    query.spatialRel ? delete query.spatialRel : null;
    query.geometryType ? delete query.geometryType : null;
    query.maxRecordCountFactor ? delete query.maxRecordCountFactor : null;
    query.outSR ? delete query.outSR : null;
    query.geometry ? delete query.geometry : null;
    query.where === '1=1' ? delete query.where : null;
    query.resultOffset ? delete query.resultOffset : null;
    query.resultType ? delete query.resultType : null;
    query.returnCountOnly ? delete query.returnCountOnly : null;
    query.returnIdsOnly ? delete query.returnIdsOnly : null;
    query.resultRecordCount ? delete query.resultRecordCount : null;
    if (query.limit) {
        delete query.resultRecordCount
        delete query.limit
    }
    return query;
}

/*
"filter" : {
    "geo_bounding_box" : {
        "pin.location" : {
            "top_left" : {
                "lat" : 40.73,
                "lon" : -74.1
            },
            "bottom_right" : {
                "lat" : 40.01,
                "lon" : -71.12
            }
        }
    }
}
}

*/