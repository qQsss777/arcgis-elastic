import * as Router from 'koa-router';
import { getGeoJSON, postGeoJSON } from '../../controllers/geojson';

export const geojsonRouter = new Router();

geojsonRouter
    .get("/:dataset/geojson", async (ctx, next) => {
        const results = await getGeoJSON({ dataset: ctx.params.dataset, url: ctx.url, query: ctx.query });
        results !== 404 ? ctx.body = results : ctx.response.status = results;
    })
    .post("/:dataset/add", async (ctx, next) => {
        const results = await postGeoJSON({ dataset: ctx.params.dataset, data: ctx.request.body });
        ctx.body = results;
    });