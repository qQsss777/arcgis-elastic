const config = require("../config.json");
const { Client } = require("@elastic/elasticsearch");

const client = new Client({
    node: `${config.elastic.protocol}://${config.elastic.host}:${config.elastic.port}`,
    auth: {
        username: config.elastic.username,
        password: config.elastic.password
    }
});

module.exports = client;