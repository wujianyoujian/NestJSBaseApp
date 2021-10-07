import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, IStrategyOption } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password'
    } as IStrategyOption);
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser({ email: email, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
