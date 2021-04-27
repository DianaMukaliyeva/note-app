import amqp, { Message, Connection, Channel } from 'amqplib/callback_api';

const queue = 'pdf';

export default () =>
  amqp.connect(process.env.RABBITMQ_URL || '', (error0: Error, connection: Connection) => {
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
