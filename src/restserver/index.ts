import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-bodyparser';
import { routersCombined } from '../routes';
import { handleNoRoute } from '../middlewares/handleNoRoute';
import { logRequest } from '../middlewares/logRequest';

//instance Koa
export const app = new Koa();

//middlewares
app.use(handleNoRoute);
app.use(logRequest);
app.use(cors());
app.use(bodyParser());
app.use(routersCombined());

