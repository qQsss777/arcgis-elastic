import { Client } from '@elastic/elasticsearch';

export interface ISearch {
    dataset: string;
    query: object;
}

export interface IResults {
    state: boolean;
    data?: IResultsData;
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


export interface ICacheDataResult {
    dates?: Array<string>;
    geom?: Array<string>;
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
