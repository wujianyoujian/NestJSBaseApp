# NestJS

* `pnpm` 和 `npm`, 运行命令一样

## `Installation`

从头开始创建新项目，选择pnpm

> `nest new <name>`

如果出现<font color="#f00">module not found</font>问题，执行下面命令
> `rimraf node_modules`

> `pnpm i`

自动生成各种文件
> `nest g module | controller | service <name>`

## `Running the server`

运行服务并且监听文件的变化
> `pnpm run start --watch`

## 控制器

### GET

* 获取url中的参数 如`/user/12?timestamp=1233896783`

> 12 - param  
> timestamp=1233896783 - query

```ts
@Controller('user')
class User {
  @Get()
  getUser(@Param('id') id: string, @Query() query) {

  }
}
```

### POST

#### 全局的 pipe validation

#### 单个pipe

* 设置pipe，验证数据的正确性

```ts
// DTO
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  content: string;
}

// CONTROLLER
@Post()
@UsePipes(ValidationPipe) // 使用Nest自带管道验证器，返回默认的错误信息
createMessage(@Body() body: CreateMessageDto) {
  return body;
}
```

## 管道

## 异常

## 拦截

## 使用TypeORM

---

[Database Link](https://docs.nestjs.com/techniques/database)

> `pnpm i --save @nest/typeorm typeorm mysql`

1. 从根模块导入

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/users.entity';
import { Report } from './modules/reports/reports.entity';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: '',
      password: '',
      database: '',
      // 使用的实体对象，就是对应数据库中的表
      // 可以直接引入所有的实体对象，"entities": ["dist/**/*.entity{.ts,.js}"]
      entities: [User, Report],
      synchronize: true
    }),
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {
}
```

2. 定义实体对象

* 配合`class-validator`来验证

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty() // 不能为空
  @Transform(({ value }) => `${value}_new`) // 定义返回值
  email: string;

  @Column()
  @IsNotEmpty()
  @Exclude() // 不返回
  password: string;
}

```

3. 使用

* 在`typeorm`中每个实体有自己的存储库，在当前的模块中注册需要使用的存储库

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {
}


// user.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private rep: Repository<User>) {
  }

  async update(id: string, attr: Partial<User>) {
    let user = await this.rep.findOne({ id: id });
    if (!user?.id) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    user = Object.assign(user, attr);
    return await this.rep.update(user.id, user);
  }

```

#### 处理和过滤返回的数据

使用`class-transoformer`配合拦截器，过滤返回的数据

```typescript
// user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;
}
```

在控制层进行拦截, 使用nest自带的类序列化拦截器

```typescript
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
}

```

#### 密码加密

* 使用盐和哈希进行加密，用相同盐加密的密码和原来的密码做比较来进行登录

```typescript
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

async login(data: CreateUserDto) {
  const user = await this.userService.findByEmail(data.email);
  if (!user) {
      throw new HttpException('this user is not registered', HttpStatus.NOT_FOUND);
  }
  const [salt, storedPassword] = user.password.split('.');
  const validPassword = ((await scrypt(data.password, salt, 32)) as Buffer).toString('hex');
  
  if (storedPassword !== validPassword) {
    throw new HttpException('password is wrong', HttpStatus.BAD_REQUEST);
  }
  return 'login successes';
}
```

## 认证

### cookie

### JWT

## 数据库迁移