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

`pnpm i --save @nest/typeorm typeorm mysql`

### Entity

[Database Link](https://docs.nestjs.com/techniques/database)

---

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