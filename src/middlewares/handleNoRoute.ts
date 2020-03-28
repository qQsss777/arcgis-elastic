import * as Koa from 'koa';

export const handleNoRoute = async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
    try {
        await next();
        const status: number = ctx.status || 404;
        if (status === 404) {
            ctx.throw(404);
        }
    } catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 404) {
            ctx.body = "Get routes or index failed.";
        } else {
            ctx.body = "Error server.";
        }
    }
};
