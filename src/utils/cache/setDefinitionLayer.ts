import { IResultsFeaturesData } from "../../interfaces/requests";

export const setDefinitionLayer = (layer: any, obj: IResultsFeaturesData, schemaFields: any) => {
    layer.name = obj.name;
    layer.fields = schemaFields;
    layer.geometryType = obj.geometry;
    layer.timeInfo = {
        startTimeField: obj.fields.dates[0],
        endTimeField: obj.fields.dates[0],
        trackIdField: null,
        timeExtent: [new Date(1900, 0, 0).getTime(), Date.now()],
        timeReference: {
            timeZone: "Pacific Standard Time",
            respectsDaylightSaving: true,
        },
        timeInterval: 1,
        timeIntervalUnits: 'esriTimeUnitsHours'
    }
}