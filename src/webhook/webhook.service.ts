import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { CustomerMicroservice } from '../constants/customer.microservice';
import { TransactionsDto } from './dto/transactions.dto';
import { noCustomersReceived, customerNotFound } from '../constants/errors';
import { decrypt, encrypt } from '@sihay.ztch/encrypt_lib';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WebhookService {
  private appSecret = process.env.APP_SECRET;

  constructor(
    @Inject(CustomerMicroservice.name) private customersClient: ClientProxy,
    private httpService: HttpService,
  ) {}

  async processQueue(payload: TransactionsDto) {
    try {
      const customers = await this.getCustomers();

      if (!customers || !Array.isArray(customers) || customers.length == 0) {
        throw new RpcException(noCustomersReceived);
      }

      const records = payload.data;
      const cutomerIds = Object.keys(records);

      for (const id of cutomerIds) {
        const data = { transactions: [] };
        const customer = customers.find((c) => c.id === id);

        if (!customer) {
          customerNotFound.message = customerNotFound.message.replace(
            ':id',
            id,
          );

          //   await this.report(customerNotFound, records[id]);
        }

        const secret = await decrypt(customer.secret, this.appSecret);

        for (const transaction of records[id]) {
          const encryptedTransaction = await encrypt(
            JSON.stringify(transaction),
            secret,
          );

          data.transactions.push(encryptedTransaction);
        }

        const endpoint = await decrypt(customer.endpoint, this.appSecret);

        await this.notify(data, endpoint);
      }
    } catch (error) {
      throw new RpcException(error);
    }
  }

  private async getCustomers() {
    const response = await this.customersClient.send(
      CustomerMicroservice.messages.getCustomers,
      {},
    );
    return await lastValueFrom(response);
  }

  private async notify(data: any, endpoint: string) {
    try {
      const response = await this.httpService
        .post(endpoint, data)
        .pipe(map((res) => res.data));

      console.log(await lastValueFrom(response));
    } catch (error) {
      console.log(error);
    }
  }

  //   private async report(data: any, payload: any) {
  //     try {
  //       await this.logger.error(
  //         this.CONTEXT,
  //         data,
  //         payload,
  //         null,
  //         'notify_transactions',
  //         null,
  //       );
  //     } catch (error) {}
  //   }
}
