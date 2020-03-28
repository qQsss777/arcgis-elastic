export interface IFeatureService {
    id: number,
    name: string,
    type: string,
    description: string,
    copyrightText: string,
    parentLayer: string,
    subLayers: string,
    minScale: number,
    maxScale: number,
    drawingInfo: {
        renderer: any,
        labelingInfo: any
    },
    defaultVisibility: boolean,
    extent: {
        xmin: number,
        ymin: number,
        xmax: number,
        ymax: number,
        spatialReference: {
            wkid: number,
            latestWkid: number
        }
    },
    hasAttachments: boolean,
    htmlPopupType: string,
    displayField: string,
    typeIdField: string,
    fields: any[],
    relationships: any[],
    canModifyLayer: boolean,
    canScaleSymbols: boolean,
    hasLabels: boolean,
    capabilities: string,
    maxRecordCount: number,
    supportsStatistics: boolean,
    supportsAdvancedQueries: boolean,
    supportedQueryFormats: string,
    ownershipBasedAccessControlForFeatures: {
        allowOthersToQuery: boolean
    },
    supportsCoordinatesQuantization: boolean,
    useStandardizedQueries: boolean,
    advancedQueryCapabilities: {
        useStandardizedQueries: boolean,
        supportsStatistics: boolean,
        supportsOrderBy: boolean,
        supportsDistinct: boolean,
        supportsPagination: boolean,
        supportsTrueCurve: boolean,
        supportsReturningQueryExtent: boolean,
        supportsQueryWithDistance: boolean
    },
    dateFieldsTimeReference: string,
    isDataVersioned: boolean,
    supportsRollbackOnFailureParameter: boolean,
    hasM: boolean,
    hasZ: boolean,
    allowGeometryUpdates: boolean,
    objectIdField: string,
    globalIdField: string,
    types: any[],
    templates: any[],
    hasStaticData: boolean,
    timeInfo: any,
    uniqueIdField: {
        name: string,
        isSystemMaintained: boolean
    },
    currentVersion: string,
    fullVersion: string,
    geometryType: string
}

export interface ILayer {
    objectIdFieldName: string,
    uniqueIdField: {
        name: string,
        isSystemMaintained: boolean
    },
    globalIdFieldName: string,
    hasZ: boolean,
    hasM: boolean,
    spatialReference: {
        wkid: number
    },
    fields: any[],
    features: any[],
    exceededTransferLimit: boolean,
    geometryType: string,
}

export interface IFeatureEsri {
    geometry: any;
    attributes: any;
}

export interface IField {
    name: string;
    type: string;
    alias: string;
    sqlType: string,
    domain: string;
    defaultValue: any
}
