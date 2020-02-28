const fs = require("fs");

class Logger {
    constructor(file) {
        Logger.instance ? Logger.instance : null;
        this.file = file;
        Logger.instance = this;
    }

    info(message) { this._writeLog(`INFO : ${message}\n`); }
    debug(message) { this._writeLog(`DEBUG : ${message}\n`); }
    warning(message) { this._writeLog(`WARNING : ${message}\n`); }
    error(message) { this._writeLog(`ERROR : ${message}\n`); }

    _writeLog(data) {
        const date = Date.now();
        const message = `${date} ${data}`;
        fs.writeFile(this.file, message, { "flag": "a" }, (err) => {
            if (err) throw err;
        });
    }
}

module.exports = Logger;