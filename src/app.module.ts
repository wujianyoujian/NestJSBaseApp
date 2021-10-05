import { Module } from '@nestjs/common';
import { UsersModule } from './controllers/users/users.module';
import { AuthModule } from './controllers/auth/auth.module';
import { ReportsModule } from './controllers/reports/reports.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './controllers/users/users.entity';
import { Report } from './controllers/reports/reports.entity';
import { AuthController } from './controllers/auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'approximately',
      database: 'car',
      entities: [User, Report],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    ReportsModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
