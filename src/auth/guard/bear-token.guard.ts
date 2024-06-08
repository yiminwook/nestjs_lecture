import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';
import { TokensEnum } from '../const/tokens.const';

@Injectable()
class BearTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const result = this.authService.verifyToken(token);

    const user = await this.usersService.getUserByEmail(result.email);

    req.token = token;
    req.type = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearTokenGuard {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.type !== TokensEnum.ACCESS) {
      throw new UnauthorizedException('Access Token이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearTokenGuard {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.type !== TokensEnum.REFRESH) {
      throw new UnauthorizedException('Refresh Token이 아닙니다.');
    }

    return true;
  }
}
