import Koa from 'koa';
import Router from 'koa-router';
import amqp, { Message } from 'amqplib/callback_api';
import amqp2, { Channel, Connection } from 'amqplib/callback_api';

import Note from '../models/Note';

const routerOpts: Router.IRouterOptions = {
  prefix: '/notes',
};

const router: Router = new Router(routerOpts);
const queue = 'work';

router.get('/', async (ctx: Koa.Context) => {
  const notes = Note.query().select('title', 'content').withGraphFetched('author');
  ctx.body = await notes;

  amqp.connect(process.env.RABBITMQ_URL || '', (error0: Error, connection: Connection) => {
    if (error0) throw error0;

    connection.createChannel((error1: Error, channel: Channel) => {
      if (error1) throw error1;
      const msg = 'Hello world';

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
});

router.get('/:noteId', async (ctx: Koa.Context) => {
  const { noteId } = ctx.params;
  const note = Note.query().select('title', 'content').findById(noteId).withGraphFetched('author');
  ctx.body = await note;

  amqp2.connect(process.env.RABBITMQ_URL || '', (error0: Error, connection: Connection) => {
    if (error0) throw error0;

    connection.createChannel((error1: Error, channel: Channel) => {
      if (error1) throw error1;

      channel.assertQueue(queue, { durable: true });
      channel.prefetch(1);
      channel.consume(
        queue,
        (msg: Message | null) => {
          setTimeout(() => {
            if (!msg) return;
            console.log(' [x] Received %s', msg.content.toString());
            channel.ack(msg);
          }, 5000);
        },
        { noAck: false },
      );
    });
  });
});

router.post('/', async (ctx: Koa.Context) => {
  const note = await Note.query().insert(ctx.request.body);
  ctx.body = note;
});

export default router;
