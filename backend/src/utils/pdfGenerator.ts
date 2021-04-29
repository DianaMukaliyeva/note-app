import amqp, { Message, Connection, Channel } from 'amqplib/callback_api';
import { jsPDF } from 'jspdf';

import User from '../models/User';

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
        async (msg: Message | null) => {
          if (!msg) return;
          const user = await User.query()
            .select('id', 'username')
            .findById(msg.content.toString())
            .withGraphFetched('notes');

          const doc = new jsPDF();
          const pageHeight = doc.internal.pageSize.height;
          const title = `Notes written by ${user.username.toUpperCase()}:`;

          doc.setFont('Courier', 'bold');
          doc.setFontSize(30);
          doc.setTextColor(25, 0, 51);
          doc.text(title, 35, 50);

          doc.setFont('Courier', 'normal');
          doc.setTextColor(87, 12, 131);
          doc.setFontSize(20);
          // Before adding new content
          let y = 80; // Height position of new content
          for (let i = 0; i < user.notes.length; i++) {
            if (y >= pageHeight - 10) {
              doc.addPage();
              y = 20; // Restart y position
            }
            // TODO count length of title and length of content and
            const note = `${i + 1}. ${user.notes[i].title}:
  ${user.notes[i].content}`;
            doc.text(note, 10, y);
            y += 30;
          }
          doc.save(`public/user${user.id}.pdf`);

          setTimeout(() => {
            channel.ack(msg);
          }, 5000);
        },
        { noAck: false },
      );
    });
  });
