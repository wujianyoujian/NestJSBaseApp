import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private readonly jwtService: JwtService) {}

  async register(data: CreateUserDto) {
    const user = await this.userService.findByEmail(data.email);
    if (user) {
      throw new HttpException('email is used', HttpStatus.BAD_REQUEST);
    }
    const salt = randomBytes(8).toString('hex');
    const hash_password = (await scrypt(data.password, salt, 32)) as Buffer;
    const encrypt_password = salt + '.' + hash_password.toString('hex');
    return await this.userService.register({ email: data.email, password: encrypt_password });
  }

  async login(payload: any) {
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async validateUser(data: CreateUserDto): Promise<any> {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new HttpException('this user is not registered', HttpStatus.NOT_FOUND);
    }
    const [salt, storedPassword] = user.password.split('.');
    const validPassword = ((await scrypt(data.password, salt, 32)) as Buffer).toString('hex');

    if (storedPassword !== validPassword) {
      throw new HttpException('password is wrong', HttpStatus.BAD_REQUEST);
    } else {
      const { password, ...result } = user;
      return result;
    }
  }
}
