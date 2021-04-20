import Koa from 'koa';
import Knex from 'knex';
import bodyParser from 'koa-bodyparser';
import { Model } from 'objection';
import jwt from 'koa-jwt';
import cors from '@koa/cors';

import knexConfig from '../db/knexfile';
import noteController from './controllers/note.controller';
import userController from './controllers/user.controller';

const knex = Knex(knexConfig.development);

Model.knex(knex);

const app: Koa = new Koa();

app.use(bodyParser());
app.use(cors());
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

// app.use(
//   jwt({
//     secret: 'secret',
//   }).unless({
//     path: [/^\/public/, '/'],
//   }),
// );

app.use(noteController.routes());
app.use(noteController.allowedMethods());
app.use(userController.routes());
app.use(userController.allowedMethods());
app.use(async (ctx: Koa.Context) => {
  ctx.body = 'Hello world';
});

app.on('error', console.error);
app.listen(3005);

export default app;
