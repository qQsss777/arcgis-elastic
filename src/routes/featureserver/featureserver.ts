import * as Router from 'koa-router'
import { getLayer } from '../../controllers/featureserver'
import { getLayerData } from '../../controllers/featureserver';

export const featureserverRouter = new Router();

featureserverRouter
    .get(/^\/(.*)(?:\/FeatureServer$)/, async (ctx, next) => {
        const results = await getLayer({ dataset: ctx.params[0], url: ctx.url });
        results !== 404 ? ctx.body = results : ctx.response.status = results;
    })
    .get("/:dataset/rest/info", async (ctx, next) => {
        ctx.body = {};
    })
    .get(/^\/(.*)(?:\/FeatureServer\/0$)/, async (ctx, next) => {
        const results = await getLayer({ dataset: ctx.params[0], url: ctx.url });
        results !== 404 ? ctx.body = results : ctx.response.status = results;
    })
    .get(/^\/(.*)(?:\/FeatureServer\/0\/query)/, async (ctx, next) => {
        const results = await getLayerData({ dataset: ctx.params[0], url: ctx.url, query: ctx.query });
        results !== 404 ? ctx.body = results : ctx.response.status = results;
    })
