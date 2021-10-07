import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';

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
      username: 'root',
      password: 'approximately',
      database: 'nestJs_BaseApp_database',
      entities: [User, Report],
      synchronize: true
    }),
    UsersModule,
    AuthModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
