import { IsNotEmpty, IsObject } from 'class-validator';

export class TransactionsDto {
  @IsNotEmpty()
  @IsObject()
  data: any;
}
