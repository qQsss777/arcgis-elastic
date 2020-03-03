import { app } from './restserver';
import { logger } from './logger';
const config = require("./config.json");

export const server = app.listen(config.server.port, config.server.host, () => {
    logger.info("server", "ok")
});