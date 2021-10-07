import { resolve } from 'path';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ReportsModule } from './modules/reports/reports.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/users.entity';
import { Report } from './modules/reports/reports.entity';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('DATABASE_CONFIG'),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {}
