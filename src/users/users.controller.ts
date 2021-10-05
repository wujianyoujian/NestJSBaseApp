import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('list')
  findAll() {
    return this.userService.findAll();
  }

  @Get('query')
  findByEmail(@Query() query: Partial<CreateUserDto>) {
    return this.userService.findByEmail(query.email);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() attr: Partial<CreateUserDto>) {
    return this.userService.update(id, attr);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.userService.register(user);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
