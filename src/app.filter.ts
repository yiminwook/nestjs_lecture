import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AppFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const code = exception?.code;

    if (code === 'ENOENT') {
      exception.message = 'Not found';
    }

    super.catch(exception, host);
  }
}
