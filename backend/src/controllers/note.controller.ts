import Koa from 'koa';
import Router from 'koa-router';
import amqp, { Channel, Connection } from 'amqplib/callback_api';

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

  const queue = 'pdf';
  amqp.connect(process.env.RABBITMQ_URL || '', (error0: Error, connection: Connection) => {
    if (error0) throw error0;

    connection.createChannel((error1: Error, channel: Channel) => {
      if (error1) throw error1;
      const msg = ctx.request.body.authorId.toString();

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
});

export default router;
