import * as Router from 'koa-router'
import { searches, postData } from '../../controllers/geojson'

export const geojsonRouter = new Router();
geojsonRouter
    .get("/:dataset/geojson", async (ctx, next) => {
        const results = await searches({ dataset: ctx.params.dataset, query: ctx.query });
        results !== 404 ? ctx.body = results : ctx.response.status = results;
    })
    .post("/:dataset/add", async (ctx, next) => {
        const results = await postData({ dataset: ctx.params.dataset, data: ctx.request.body });
        ctx.body = results;
    });