import { searchRouter } from './search';
import { addRouter } from './add';
import * as combineRouters from 'koa-combine-routers';

export const routersCombined = combineRouters(
    searchRouter,
    addRouter
);
