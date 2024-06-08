import {
  Body,
  Controller,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bear-token.guard';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken, true);
    const newToken = this.authService.rotateToken(token, false);
    return { accessToken: newToken };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(@Headers('authorization') rowToken: string) {
    const token = this.authService.extractTokenFromHeader(rowToken, true);
    const newToken = this.authService.rotateToken(token, true);
    return { refreshToken: newToken };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@User() user: UsersModel) {
    return this.authService.loginUser(user);
  }

  @Post('register/email')
  postRegisterEmail(
    @Body('email') email: string,
    @Body('password', new MaxLengthPipe(8), new MinLengthPipe(3))
    password: string,
    @Body('nickname') nickname: string,
  ) {
    return this.authService.registerWithEmail({
      email,
      password,
      nickname,
    });
  }
}
