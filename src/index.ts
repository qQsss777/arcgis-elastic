import { app } from './restserver';
const config = require("./config.json");

export const server = app.listen(config.server.port, config.server.host, () => {
    //logger.info("Server started");
});