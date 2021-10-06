import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    const result = await this.authService.register(data);
    if (!result || !result.id) {
      throw new HttpException('register user is failed', HttpStatus.BAD_REQUEST);
    }
    return 'this user is successes registered';
  }

  @Post('login')
  async login(@Body() data: CreateUserDto) {
    return this.authService.login(data);
  }
}
