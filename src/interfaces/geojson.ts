export interface IInformationsSchema {
    feature: any,
    objectId: number | string,
    geometry: string,
    fieldGeometry: string,
    dates: Array<string>,
    integers: Array<string>,
    doubles: Array<string>
}

export interface IFeaturesCollection {
    type: string;
    features: Array<IFeature>;
}

export interface IFeature {
    type: string;
    geometry: {
        type: any;
        coordinates: any;
    };
    properties: any;
}