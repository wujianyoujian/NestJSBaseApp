import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  register(data: CreateUserDto) {
    const user = this.userService.findByEmail(data.email);
  }

  login() {}
}
