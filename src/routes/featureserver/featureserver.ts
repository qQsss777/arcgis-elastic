import * as Router from 'koa-router'
import { searches } from '../../controllers/featureserver'
import { query } from '../../controllers/featureserver';

export const featureserverRouter = new Router();
featureserverRouter
    .get("/:dataset/FeatureServer/0", async (ctx, next) => {
        const results = await searches({ dataset: ctx.params.dataset });
        ctx.body = results;
    })
    .get("/:dataset/FeatureServer/0/query", async (ctx, next) => {
        const results = await query({ dataset: ctx.params.dataset, query: ctx.query });
        ctx.body = results;
    });