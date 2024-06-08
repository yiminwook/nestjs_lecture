import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { UsersModel } from '../entities/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user: UsersModel = req.user;

    if (!user) {
      throw new InternalServerErrorException(
        'Request에 user 프로퍼티가 존재하지 않습니다.',
      );
    }

    return data ? user[data] : user;
  },
);
