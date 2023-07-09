import {
  Controller,
  Post,
  Body,
  HttpException,
  Res,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

import UsersGlobalService from './usersGlobal.service';
import SessionTokenService from './auth/jwt/sessionToken.service';

import LoginUserDTO from './pipes/loginUser.pipe';

@Controller('users')
export default class UsersGlobalController {
  constructor(
    private readonly usersGlobalService: UsersGlobalService,
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  @Post('login')
  async UserLogin(
    @Body() data: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const usuario = await this.usersGlobalService.Login(data);
      await this.sessionTokenService.generateRefreshToken(usuario.id, res);
      return { ok: true };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async Refresh(@Req() req: Request) {
    try {
      const usuario = req.user;
      const accessToken = await this.sessionTokenService.generateAccessToken(
        usuario['id'],
      );
      return { ok: true, accessToken, seconds: 900 };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('session')
  @UseGuards(AuthGuard('jwt'))
  async Session(@Req() req: Request) {
    try {
      return await this.usersGlobalService.Session(req.user['id']);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('close')
  @UseGuards(AuthGuard('jwt'))
  Logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');
    return { ok: true, message: 'Sesion terminada' };
  }
}
