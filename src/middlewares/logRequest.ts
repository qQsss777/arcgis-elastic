import * as Koa from 'koa';
import { logger } from '../logger';

export const logRequest = async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
    await next();
    logger.info(ctx.path, ctx.method, ctx.status)
};
