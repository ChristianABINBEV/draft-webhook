import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { log } from 'console';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CustomerMicroservice } from './constants/customer.microservice';

async function bootstrap() {
  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3001;
  const queue = process.env.WEBHOOK_QUEUE || CustomerMicroservice.queue;
  const messageBrokerHost = process.env.MESSAGE_BROKER_HOST;
  const messageBrokerPort = process.env.MESSAGE_BROKER_PORT || 5672;
  const messageBrokerUser = process.env.MESSAGE_BROKER_USER;
  const messageBrokerPass = process.env.MESSAGE_BROKER_PASS;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${messageBrokerUser}:${messageBrokerPass}@${messageBrokerHost}:${messageBrokerPort}`,
        ],
        queue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen().then(() => {
    log(`
     ============================================
     =  Microservice execution info:
     =  NAME: ${process.env.APP_NAME}
     =  PORT: ${port}
     ============================================
     `);
  });
}

bootstrap();
