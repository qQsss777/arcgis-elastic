import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-bodyparser';
import { routersCombined } from '../routes';
import { handleNoRoute } from '../routes/handleNoRoute';

//instance Koa
export const app = new Koa();

//middleware
app.use(handleNoRoute);
app.use(cors());
app.use(bodyParser());
app.use(routersCombined());




