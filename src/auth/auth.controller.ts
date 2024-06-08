import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entities/users.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bear-token.guard';

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
  postRegisterEmail(@Body() userDto: RegisterUserDto) {
    return this.authService.registerWithEmail(userDto);
  }
}
