import Koa from 'koa';
import Router from 'koa-router';

import Note from '../models/Note';

const routerOpts: Router.IRouterOptions = {
  prefix: '/note',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  const note = Note.query();
  ctx.body = await note;
});

router.post('/', async (ctx: Koa.Context) => {
  const note = await Note.query().insert(ctx.request.body);
  ctx.body = note;
});

export default router;
