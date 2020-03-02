import * as Router from 'koa-router'
import { postData } from '../controllers';

export const addRouter = new Router();

addRouter
    .post("/:dataset/add", async (ctx, next) => {
        const results = await postData({ dataset: ctx.params.dataset, data: ctx.request.body });
        ctx.body = results;
    });


