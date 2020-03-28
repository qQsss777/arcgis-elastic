import * as Router from 'koa-router'
import { getLayer } from '../../controllers/featureserver'
import { getLayerData } from '../../controllers/featureserver';

export const featureserverRouter = new Router();
featureserverRouter
    .get("/:dataset/FeatureServer/0", async (ctx, next) => {
        const results = await getLayer({ dataset: ctx.params.dataset, url: ctx.url });
        results !== 404 ? ctx.body = results : ctx.response.status = results;
    })
    .get("/:dataset/FeatureServer/0/query", async (ctx, next) => {
        const results = await getLayerData({ dataset: ctx.params.dataset, url: ctx.url, query: ctx.query });
        results !== 404 ? ctx.body = results : ctx.response.status = results;
    });