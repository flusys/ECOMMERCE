import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserSchema } from '../../modules/user/user.schema';
import { PASSPORT_USER_TOKEN_TYPE } from '../../core/static-variable';
import { JwtUserStrategy } from './jwt-user.strategy';
import { UserService } from './user.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: PASSPORT_USER_TOKEN_TYPE,
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('userJwtSecret'),
        signOptions: {
          expiresIn: configService.get<number>('userTokenExpiredTime'),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtUserStrategy],
  exports: [PassportModule],
})
export class UserModule {}