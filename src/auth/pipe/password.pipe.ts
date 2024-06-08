import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { In } from 'typeorm';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    const str = value.toString();

    if (str.toString().length > 8) {
      throw new BadRequestException('비밀번호는 8자 이하로 입력해주세요.');
    }

    return str;
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly maxLength: number) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const str = value.toString();

    if (str.length > this.maxLength) {
      throw new BadRequestException(
        `최대 ${this.maxLength}자 이하로 입력해주세요.`,
      );
    }

    return str;
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly minLength: number) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const str = value.toString();

    if (str.length < this.minLength) {
      throw new BadRequestException(
        `최소 ${this.minLength}자 이상으로 입력해주세요.`,
      );
    }

    return str;
  }
}
