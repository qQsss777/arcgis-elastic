import { Client } from '@elastic/elasticsearch';

//all interfaces used in this app
export interface IGeoJSONSearch {
    dataset: string;
    query: object;
}

export interface IFeatureServerSearch {
    dataset: string;
}

export interface IResults {
    state: boolean;
    data?: IResultsData;
}

export interface IResultsTemp {
    state: boolean;
    data?: any;
}

export interface IQuery {
    query?: {
        multi_match: IMultimatch;
    };
}

export interface IMultimatch {
    query: string;
    fields: Array<string>;
}

export interface ICacheData {
    dataset: string;
    connection: Client;
}

export interface IResultsData {
    fields: ICacheDataResult;
    source: Array<any>
};

export interface IResultsFeaturesData {
    name: string;
    fields: ICacheDataResult;
    source: Array<any>
};

export interface ICacheDataResult {
    dates?: Array<string>;
    geom?: Array<string>;
    integer?: Array<string>;
    double?: Array<string>;
}

// Complete definition of the Search response
export interface ShardsResponse {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
}

export interface Explanation {
    value: number;
    description: string;
    details: Explanation[];
}

export interface ISearchResponse<T> {
    took: number;
    timed_out: boolean;
    _scroll_id?: string;
    _shards: ShardsResponse;
    hits: {
        total: number;
        max_score: number;
        hits: Array<{
            _index: string;
            _type: string;
            _id: string;
            _score: number;
            _source: T;
            _version?: number;
            _explanation?: Explanation;
            fields?: any;
            highlight?: any;
            inner_hits?: any;
            matched_queries?: string[];
            sort?: string[];
        }>;
    };
    aggregations?: any;
}

export interface IFeaturesCollection {
    type: string;
    features: Array<IFeature>;
    metadata?: object;
}

export interface IFeature {
    type: string;
    geometry: {
        type: any;
        coordinates: any;
    };
    properties: any;
}

export interface IPostData {
    dataset: string;
    data: any
}

export interface IFeatureServer {
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
    }
}

export interface IFeatures {
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
    exceededTransferLimit: boolean
}