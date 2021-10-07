import { Request, Body, Controller, HttpException, HttpStatus, Post, UseGuards, Get } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    // 经过LocalAuthGuard对应的LocalStrategy验证，验证通过会讲结果存放在req中
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    const result = await this.authService.register(data);
    if (!result || !result.id) {
      throw new HttpException('register user is failed', HttpStatus.BAD_REQUEST);
    }
    return 'this user is successes registered';
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    if (req?.user?.userId && req?.user?.email) {
      return '请求头像数据成功';
    }
    return '';
  }
}
