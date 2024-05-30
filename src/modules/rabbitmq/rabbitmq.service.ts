import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private __connection: amqp.Connection;
  private __channel: amqp.Channel;

  constructor(private readonly __configService: ConfigService) {}

  async onModuleInit() {
    const rabbitMQUrl = this.__configService.get<string>('rabbitmq.url');
    this.__connection = await amqp.connect(rabbitMQUrl);
    this.__channel = await this.__connection.createConfirmChannel();
  }

  // create a new exchange
  async assertExchange(
    exchangeName: string,
    exchangeType: string,
    durable: boolean = false,
  ) {
    await this.__channel.assertExchange(exchangeName, exchangeType, {
      durable,
    });
  }

  // create a new queue
  async assertQueue(queue: string, durable: boolean = false) {
    await this.__channel.assertQueue(queue, { durable });
  }

  // bind a queue to an exchange
  async bindQueue(queue: string, exchange: string, routingKey: string) {
    await this.__channel.bindQueue(queue, exchange, routingKey);
  }

  // send message to a queue
  async sendToExchange(exchange: string, routingKey: string, message: string) {
    this.__channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(
    queue: string,
    callback: (msg: amqp.ConsumeMessage | null) => void,
  ) {
    await this.__channel.assertQueue(queue, { durable: false });
    this.__channel.consume(queue, callback, { noAck: true });
  }

  async publicMessageToExchange({
    exchange,
    routingKey,
    message,
    exchangeType,
    durable,
  }: {
    exchange: string;
    routingKey: string;
    message: string;
    exchangeType: string;
    durable: boolean;
  }) {
    await this.assertExchange(exchange, exchangeType, durable);
    await this.sendToExchange(exchange, routingKey, message);
  }
}
