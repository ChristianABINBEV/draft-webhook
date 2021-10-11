import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { RMQLoggerService } from '@sihay.ztch/logger_async';
import { throwError } from 'rxjs';

@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  @Inject('RMQ_LOGGER')
  private logger: RMQLoggerService;
  private CONTEXT = 'ADAPTER EXCEPTION';

  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToRpc();
    const path = context.getContext().args[1];
    const payload = context.getData();
    const formatedException =
      exception instanceof BadRequestException
        ? this.badRequestFormatException(exception)
        : this.httpClientFormatException(exception);

    console.log('ERROR', formatedException);

    this.logger.error(
      this.CONTEXT,
      formatedException,
      payload,
      null,
      path,
      null,
    );

    return throwError(() => formatedException);
  }

  private badRequestFormatException(exception: any) {
    return {
      code: HttpStatus.BAD_REQUEST,
      path: null,
      timestamp: new Date().toISOString(),
      error: exception?.response?.error,
      message: exception?.response?.error,
      data: exception?.response?.message,
    };
  }

  private httpClientFormatException(exception: any) {
    const internalServerError = 'Internal Server Error';

    return {
      code: exception?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      path: exception?.respone?.path,
      timestamp: new Date().toISOString(),
      error: exception?.response?.statusText || internalServerError,
      message: exception?.message || internalServerError,
      data: exception?.response?.data || {},
    };
  }
}
