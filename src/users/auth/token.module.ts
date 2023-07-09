import { Module } from '@nestjs/common';
import AccessTokenStrategy from './strategies/accessToken.strategy';
import RefreshTokenStrategy from './strategies/refreshToken.strategy';
import SessionTokenService from './jwt/sessionToken.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [AccessTokenStrategy, RefreshTokenStrategy, SessionTokenService],
  exports: [AccessTokenStrategy, RefreshTokenStrategy, SessionTokenService],
})
export class TokenModule {}
