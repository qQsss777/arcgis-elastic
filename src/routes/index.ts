import { geojsonRouter } from './geojson';
import { addRouter } from './add';
import * as combineRouters from 'koa-combine-routers';

export const routersCombined = combineRouters(
    geojsonRouter,
    addRouter
);
