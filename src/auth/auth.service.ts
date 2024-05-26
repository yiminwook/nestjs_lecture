import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { TokensEnum } from './const/tokens.const';
import { JWT_SECRET } from './const/auth.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwrService: JwtService,
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  async authenticateWithEmailAndPassword() {}

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
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
