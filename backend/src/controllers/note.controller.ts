import Koa from 'koa';
import Router from 'koa-router';

import Note from '../models/Note';

const routerOpts: Router.IRouterOptions = {
  prefix: '/notes',
};

const router: Router = new Router(routerOpts);

router.get('/', async (ctx: Koa.Context) => {
  const notes = Note.query().select('title', 'content').withGraphFetched('author');
  ctx.body = await notes;
});

router.get('/:noteId', async (ctx: Koa.Context) => {
  const { noteId } = ctx.params;
  const note = Note.query().select('title', 'content').findById(noteId).withGraphFetched('author');
  ctx.body = await note;
});

router.post('/', async (ctx: Koa.Context) => {
  const note = await Note.query().insert(ctx.request.body);
  ctx.body = note;
});

export default router;
