import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.SECRET,
      signOptions: { expiresIn: '60s' }
    })
  ],
  providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
