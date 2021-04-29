import amqp, { Channel, Connection } from 'amqplib/callback_api';

const queue = 'pdf';

export default function (authorId: Number) {
  amqp.connect(process.env.RABBITMQ_URL || '', (error0: Error, connection: Connection) => {
    if (error0) throw error0;
    connection.createChannel((error1: Error, channel: Channel) => {
      if (error1) throw error1;
      const msg = authorId.toString();

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
}
