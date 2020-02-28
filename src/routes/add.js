const Router = require("@koa/router");
const router = new Router();
const postData = require("../controllers/add");
router
    .post("/:dataset/add", async (ctx, next) => {
        const results = await postData(ctx.params, ctx.request.body);
        ctx.body = results;
    });

module.exports = router;
