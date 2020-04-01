export const purgeQuery = async (query: any): Promise<any> => {
    //first delete useless params
    query.f ? delete query.f : null;
    query.maxAllowableOffset ? delete query.maxAllowableOffset : null;
    query.outFields ? delete query.outFields : null;
    query.inSR ? delete query.inSR : null;
    query.returnExceededLimitFeatures ? delete query.returnExceededLimitFeatures : null;
    query.spatialRel ? delete query.spatialRel : null
    query.geometryType ? delete query.geometryType : null
    query.maxRecordCountFactor ? delete query.maxRecordCountFactor : null;
    query.outSR ? delete query.outSR : null
    query.geometry ? delete query.geometry : null
    query.where === '1=1' ? delete query.where : null;
    query.offset ? delete query.resultOffset : null
    query.resultType ? delete query.resultType : null
    if (query.limit) {
        delete query.resultRecordCount
        delete query.limit
    }
    return query;
}