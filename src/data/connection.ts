const config = require("../config.json");
import { Client } from '@elastic/elasticsearch';

let client: Client;

if (config.elastic.secure) {
    client = new Client({
        node: `${config.elastic.protocol}://${config.elastic.host}:${config.elastic.port}`,
        auth: { username: config.elastic.username, password: config.elastic.password }
    });
}
else {
    client = new Client({
        node: `${config.elastic.protocol}://${config.elastic.host}:${config.elastic.port}`
    });
};


export { client };