import * as Router from 'koa-router'
import { searches } from '../controllers'

export const searchRouter = new Router();
searchRouter
    .get("/:dataset/search", async (ctx, next) => {
        const results = await searches({ dataset: ctx.params.dataset, query: ctx.query });
        ctx.body = results;
    });