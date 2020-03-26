import * as Router from 'koa-router'
import { searches } from '../controllers'

export const featureserverRouter = new Router();
featureserverRouter
    .get("/:dataset/featureserver/0", async (ctx, next) => {
        const results = await searches({ dataset: ctx.params.dataset, query: ctx.query });
        ctx.body = results;
    });