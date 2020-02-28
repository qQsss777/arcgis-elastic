const search = require("./search");
const add = require("./add");
const combineRouters = require("koa-combine-routers");

const router = combineRouters(
    search,
    add
);

module.exports = router;