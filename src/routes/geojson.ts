import * as Router from 'koa-router'
import { searches } from '../controllers'

export const geojsonRouter = new Router();
geojsonRouter
    .get("/:dataset/geojson", async (ctx, next) => {
        const results = await searches({ dataset: ctx.params.dataset, query: ctx.query });
        ctx.body = results;
    });