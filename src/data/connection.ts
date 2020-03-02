const config = require("../config.json");
import { Client } from '@elastic/elasticsearch';


export const client = new Client({
    node: `${config.elastic.protocol}://${config.elastic.host}:${config.elastic.port}`,
    auth: {
        username: config.elastic.username,
        password: config.elastic.password
    }
});