import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WebhookService } from './webhook.service';
import { TransactionsDto } from './dto/transactions.dto';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_transactions')
  async notify(@Payload() data: TransactionsDto) {
    await this.webhookService.processQueue(data);
  }
}
