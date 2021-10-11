import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomerMicroservice } from '../constants/customer.microservice';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: CustomerMicroservice.name,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          name: CustomerMicroservice.name,
          transport: Transport.TCP,
          options: {
            host: config.get('CUSTOMER_HOST'),
            port: config.get('CUSTOMER_PORT'),
          },
        }),
      },
    ]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
