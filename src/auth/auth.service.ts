import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { HASH_ROUND, JWT_SECRET } from './const/auth.const';
import { TokensEnum } from './const/tokens.const';
import { UsersService } from 'src/users/users.service';
import * as bycrypt from 'bcrypt';

type PayLoad = {
  sub: number;
  email: string;
  type: TokensEnum;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwrService: JwtService,
    private readonly userService: UsersService,
  ) {}

  extractTokenFromHeader(header: string, isBearer: boolean) {
    const [type, token] = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';

    const isValidate = type && token && prefix === type;

    if (!isValidate) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    return token;
  }

  decodeBasicToken(token: string) {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, password] = decoded.split(':');

    if (!email || !password) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }

    return { email, password };
  }

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
    const payload: PayLoad = {
      sub: user.id,
      email: user.email,
      type: isRefreshToken ? TokensEnum.REFRESH : TokensEnum.ACCESS,
    };

    return this.jwrService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300, //초단위
    });
  }

  verifyToken(token: string) {
    return this.jwrService.verify<PayLoad>(token, { secret: JWT_SECRET });
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwrService.verify<PayLoad>(token, {
      secret: JWT_SECRET,
    });

    if (decoded.type !== TokensEnum.REFRESH) {
      throw new UnauthorizedException('리프레시 토큰이 아닙니다.');
    }

    return this.signToken(
      { id: decoded.sub, email: decoded.email },
      isRefreshToken,
    );
  }

  //회원가입 후 바로 로그인
  async registerWithEmail(
    user: Pick<UsersModel, 'email' | 'password' | 'nickname'>,
  ) {
    const hash = await bycrypt.hash(user.password, HASH_ROUND);
    const newUser = await this.userService.createUser({
      ...user,
      password: hash,
    });
    return this.loginUser(newUser);
  }

  //로그인
  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(existingUser);
  }
}
