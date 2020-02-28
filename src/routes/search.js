const Router = require("@koa/router");
const router = new Router();
const searches = require("../controllers/searches");

router
    .get("/:dataset/search", async (ctx, next) => {
        const results = await searches(ctx.params, ctx.query);
        ctx.body = results;
    });

module.exports = router;
