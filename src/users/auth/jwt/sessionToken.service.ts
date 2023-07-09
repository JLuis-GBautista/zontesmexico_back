import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export default class SessionTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateAccessToken(id: number) {
    const JwtPayload: object = { id };
    return await this.jwtService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(id: number, res: Response) {
    const JwtPayload: object = { id };
    const refreshToken = await this.jwtService.signAsync(JwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    return;
  }
}
