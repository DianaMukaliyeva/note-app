import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';

const app: Koa = new Koa();

app.use(async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.statusCode || error.status;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit('error', error, ctx);
  }
});

app.use(bodyParser());

app.use(async (ctx: Context) => {
  ctx.body = 'Hello world';
});

app.on('error', console.error);

app.listen(3005);

export default app;
