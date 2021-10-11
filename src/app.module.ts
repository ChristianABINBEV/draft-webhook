import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WebhookModule } from './webhook/webhook.module';
import { AllExceptionsFilter } from './filters/exceptions.filter';
import { RMQLoggerService } from '@sihay.ztch/logger_async';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    WebhookModule,
  ],
  providers: [
    RMQLoggerService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: 'RMQ_LOGGER',
      useExisting: RMQLoggerService,
    },
  ],
})
export class AppModule {}
