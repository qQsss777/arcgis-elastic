const RedisCache = require("./Cache");

const getSchemaData = async (params, client) => {

    //connect to redis db
    const redisCache = new RedisCache();
    const schemaCache = `${params.dataset}-schema`;
    redisCache.delete(schemaCache);
    //check if keys and values exist
    const schemaCached = await redisCache.getAsync(schemaCache);
    //if not, get field mapping, set value to redis db and return object with value
    if (!schemaCached) {
        try {
            //get mapping information
            const { body } = await client.indices.getMapping({ index: params.dataset });
            const data = body[params.dataset].mappings.properties;
            const schema = await convertGeoType(data);
            await redisCache.setAsync(schemaCache, JSON.stringify(schema));
            redisCache.end();
            return schema;
        }
        catch (e) {
            return { state: false, data: e };
        }
    } else {
        redisCache.end();
        return schemaCached;
    }
};

const convertGeoType = async (obj) => {
    const typeGeom = ["geo_point", "point", "polyline", "polygon"];
    const typeKeyword = ["keyword", "text", "date"];
    const allowedTypes = "any";
    const schemaValues = Object.values(obj);
    const schemaKeys = Object.keys(obj);
    const schemaUpdated = {};

    for (let i = 0; i < schemaValues.length; i++) {
        const key = schemaKeys[i];
        const val = schemaValues[i];
        const typeOfGoem = typeGeom.includes(val.type) ? allowedTypes : val.type;
        const typeUpdated = typeKeyword.includes(val.type) ? "string" : typeOfGoem;
        schemaUpdated[key] = { type: typeUpdated };
    };
    return schemaUpdated;
};

module.exports = getSchemaData;