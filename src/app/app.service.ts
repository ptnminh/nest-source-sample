import { RabbitMQService } from '@modules/rabbitmq/rabbitmq.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly __rabbitMQService: RabbitMQService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async sendToExchange() {
    return await this.__rabbitMQService.publicMessageToExchange({
      exchange: 'exchange2',
      routingKey: 'routingKey',
      message: 'message',
      exchangeType: 'direct',
      durable: true,
    });
  }
}
