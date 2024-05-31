import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { JWT_SECRET } from './const/auth.const';
import { TokensEnum } from './const/tokens.const';
import { UsersService } from 'src/users/users.service';
import * as bycrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwrService: JwtService,
    private readonly userService: UsersService,
  ) {}

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.userService.getUserByEmail(user.email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    const isPass = await bycrypt.compare(user.password, existingUser.password);

    if (!isPass) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existingUser;
  }

  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      sub: user.id,
      email: user.email,
      type: isRefreshToken ? TokensEnum.REFRESH : TokensEnum.ACCESS,
    };

    return this.jwrService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300, //초단위
    });
  }

  //회원가입 후 바로 로그인
  async registerWithEmail(email: string, nickname: string, password: string) {
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
  }

  //로그인
  async loginWithEmail(email: string, password: string) {
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
  }
}
