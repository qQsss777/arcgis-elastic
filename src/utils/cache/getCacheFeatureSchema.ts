import { logger } from '../../logger';
import { ICacheData } from '../../interfaces/requests';
import { IField } from '../../interfaces/esri';

export const getCacheFeatureSchema = async (obj: ICacheData): Promise<any> => {
    try {
        logger.info(`init cache feature schema for ${obj.dataset}`)
        //get mapping information
        const { body } = await obj.connection.indices.getMapping({ index: obj.dataset });
        const data = body[obj.dataset].mappings.properties;
        const schema = await convertFieldType(data);
        const listFields = await createListFields(schema)
        logger.info(`caching feature schema for ${obj.dataset} finished`)
        return listFields;
    }
    catch (e) {
        logger.error(`error getting feature structure data for ${obj.dataset}`)
        return { state: false, data: e };
    }
};

const convertFieldType = async (obj: any): Promise<any> => {
    const schemaValues = Object.values(obj);
    const schemaKeys = Object.keys(obj);
    const schemaUpdated: any = {};

    for (let i = 0; i < schemaValues.length; i++) {
        const key: string = schemaKeys[i];
        const val: any = schemaValues[i];
        switch (val.type) {
            case ('integer'):
                schemaUpdated[key] = { type: 'esriFieldTypeInteger' };
                break;
            case ('double'):
                schemaUpdated[key] = { type: 'esriFieldTypeDouble' };
                break;
            case ('keyword'):
                schemaUpdated[key] = { type: 'esriFieldTypeString' };
                break;
            case ('text'):
                schemaUpdated[key] = { type: 'esriFieldTypeString' };
                break;
            case ('date'):
                schemaUpdated[key] = { type: 'esriFieldTypeDate' };
                break;
            default:
                schemaUpdated[key] = { type: 'esriFieldTypeString' };
        }
    };
    return schemaUpdated;
};

const createListFields = async (schema: any): Promise<any> => {
    const listFields: IField[] = []
    const fieldsEsri: IField = Object.assign(require('../../../templates/fields.json'));
    const objectid: IField = JSON.parse(JSON.stringify(fieldsEsri));
    objectid.name = "OBJECTID";
    objectid.alias = "OBJECTID";
    objectid.type = "esriFieldTypeOID";
    objectid.sqlType = "sqlTypeInteger"
    listFields.push(objectid);

    const globalid: IField = JSON.parse(JSON.stringify(fieldsEsri));
    globalid.name = "GLOBALID";
    globalid.alias = "GLOBALID";
    globalid.type = "esriFieldTypeOID";
    listFields.push(globalid);

    for (const [key, value] of Object.entries(schema)) {
        const val: any = value;
        const field: IField = JSON.parse(JSON.stringify(fieldsEsri));
        field.name = key;
        field.alias = key;
        field.type = val.type;
        listFields.push(field);
    }
    return listFields;
};