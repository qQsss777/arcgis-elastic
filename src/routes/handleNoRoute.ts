import * as Koa from 'koa';
export const handleNoRoute = async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
    try {
        await next();
        const status = ctx.status || 404;
        if (status === 404) {
            ctx.throw(404);
        }
    } catch (err) {
        ctx.status = err.status || 500;
        if (ctx.status === 404) {
            ctx.body = "Pas d'index'";
        } else {
            ctx.body = "Erreur serveur";
        }
    }
};
