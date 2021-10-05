import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private rep: Repository<User>) {}

  async register(data: CreateUserDto): Promise<void> {
    const user: CreateUserDto = this.rep.create(data);
    await this.rep.save(user);
    return Promise.resolve();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.rep.findOne({ email: email });
  }

  async findAll(): Promise<Array<User>> {
    return await this.rep.find();
  }

  async update(id: number, attr: Partial<User>) {
    let user = await this.rep.findOne({ id: id });
    if (!user?.id) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    user = Object.assign(user, attr);
    return await this.rep.update(user.id, user);
  }

  async delete(id: number) {
    const user = await this.rep.findOne({ id: id });
    if (!user?.id) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    return await this.rep.delete(user.id);
  }
}
