import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/static-variable';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(
  Strategy,
  PASSPORT_USER_TOKEN_TYPE,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('userJwtSecret'),
    });
  }

  async validate(payload: any) {
    return { _id: payload._id, firstname: payload.firstname };
  }
}