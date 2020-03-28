import { geojsonRouter } from './geojson/geojson';
import { featureserverRouter } from './featureserver/featureserver';
import * as combineRouters from 'koa-combine-routers';

export const routersCombined = combineRouters(
    geojsonRouter,
    featureserverRouter
);
