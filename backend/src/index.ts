import dotenv from 'dotenv';
import Koa from 'koa';
import Knex from 'knex';
import bodyParser from 'koa-bodyparser';
import { ForeignKeyViolationError, Model, ValidationError } from 'objection';
import jwt from 'koa-jwt';
import cors from '@koa/cors';

import knexConfig from '../db/knexfile';
import noteController from './controllers/note.controller';
import userController from './controllers/user.controller';
import pdfGenerator from './utils/pdfGenerator';

dotenv.config();

const knex = Knex(knexConfig.development);

Model.knex(knex);

const app: Koa = new Koa();

app.use(bodyParser());
app.use(cors());
app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = {
        error: 'ValidationError',
        errors: error.data,
      };
    } else if (error instanceof ForeignKeyViolationError) {
      ctx.status = 409;
      ctx.body = {
        error: 'ForeignKeyViolationError',
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: 'InternalServerError',
        message: error.message || {},
      };
    }
  }
});

// app.use(
//   jwt({
//     secret: 'secret',
//   }).unless({
//     path: [/^\/public/, '/'],
//   }),
// );

pdfGenerator();

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
