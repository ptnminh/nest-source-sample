/* eslint-disable @typescript-eslint/no-var-requires */
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost:5672', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    channel.assertExchange('exchange2', 'direct', {
      durable: true,
    });
    const queue = 'queue1';
    channel.assertQueue(queue, {
      durable: true,
    });
    channel.bindQueue(queue, 'exchange2', 'routingKey1');

    channel.consume(
      queue,
      function (msg) {
        console.log(' [x] Received %s', msg.content.toString());
      },
      {
        noAck: true,
      },
    );
  });
});
