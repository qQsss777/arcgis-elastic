import { Client } from "@elastic/elasticsearch";

export interface IDataSearch {
    dataset: string;
    url: string;
    query: any;
}

export interface ICacheDataResult {
    dates?: Array<string>;
    geom?: Array<string>;
    integers?: Array<string>;
    doubles?: Array<string>;
}

export interface IResultsData {
    fields: ICacheDataResult;
    source: Array<any>
};

export interface IResults {
    state: boolean;
    data?: IResultsData;
}

export interface IPostResults {
    state: boolean;
    data?: any;
}

export interface ICacheData {
    dataset: string;
    connection: Client;
}

export interface IPostData {
    dataset: string;
    data: any
}

export interface IResultsTemp {
    state: boolean;
    data?: any;
}

export interface IResultsFeaturesData {
    name: string;
    fields: ICacheDataResult;
    source: Array<any>;
    geometry?: string;
};

export interface IResultsFeatureServiceData {
    fields: IResultsFeaturesData;
    source: Array<any>
};

export interface IFeatureServerSearch {
    dataset: string;
    url: string;
}