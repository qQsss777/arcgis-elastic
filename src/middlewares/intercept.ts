import * as Koa from 'koa';
import { logger } from '../logger';

export const intercept = async (ctx: Koa.Context, next: () => Promise<any>) => {
    await next()
};
