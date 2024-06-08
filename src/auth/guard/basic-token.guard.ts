import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  /** 통과할 수 있는지 없는지에 대한 함수 */
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const payload = this.authService.decodeBasicToken(token);

    const user =
      await this.authService.authenticateWithEmailAndPassword(payload);

    req.user = user;

    return true;
  }
}
