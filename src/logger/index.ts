import * as winston from 'winston';
import DailyRotateFile = require("winston-daily-rotate-file");

const transport = new DailyRotateFile({
    filename: 'ESConnector-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

export const logger = winston.createLogger({
    transports: [
        transport
    ]
});

