"use strict";
const serverRest = require("./restserver");
const Logger = require("./logger/Logger");
const config = require("./config.json");

const logger = new Logger(config.server.log);
const server = serverRest.listen(config.server.port, config.server.host, _ => {
    logger.info("Server started");
});

module.exports = { server };