import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const code = exception?.code;
    if (code === 'ENOENT') {
      exception.message = 'Not found';
    }
    super.catch(exception, host);
  }
}
