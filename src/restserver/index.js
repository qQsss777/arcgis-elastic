const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const router = require("../routes");
const handleNoRoute = require("./handleNoRoute");
//instance Koa
const app = new Koa();

//middleware
app.use(handleNoRoute);
app.use(cors());
app.use(bodyParser());
app.use(router());

module.exports = app;
