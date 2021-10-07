import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('list')
  findAll() {
    return this.userService.findAll();
  }

  @Get('params')
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() attr: Partial<CreateUserDto>) {
    return this.userService.update(id, attr);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
