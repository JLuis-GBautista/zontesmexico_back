import {
  Body,
  Controller,
  Delete,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import CreateUserDTO from 'src/users/pipes/createUser.pipe';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import UsersGlobalService from 'src/users/usersGlobal.service';
import { UpdatePersonalUserDTO } from 'src/users/pipes/editUser.pipe';
import NormalUserService from './comun.service';
import { encriptarClave } from 'src/users/auth/libs/bcrypt';

@Controller('comun')
export default class NormalUserController {
  constructor(
    private readonly normalUserService: NormalUserService,
    private readonly sesionService: UsersGlobalService,
  ) {}
  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  async NormalUserRegister(@Body() data: CreateUserDTO, @Req() req: Request) {
    const userSesion = req.user;
    try {
      await this.normalUserService.isAdminOrOwner(userSesion['id']);
      await this.normalUserService.RegisterNormalUser(data);
      return { ok: true, message: 'usuario creado exitosamente' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('person_update')
  @UseGuards(AuthGuard('jwt'))
  async UpdatePersonNormalUser(
    @Body() data: UpdatePersonalUserDTO,
    @Req() req: Request,
  ) {
    const userSesion = req.user;
    try {
      await this.normalUserService.UpdatePersonNormalUser(
        userSesion['id'],
        data,
      );
      return await this.sesionService.Session(userSesion['id']);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  async UpdateNormalUsers(
    @Body() data: CreateUserDTO,
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    const userSesion = req.user;
    try {
      await this.normalUserService.isAdminOrOwner(userSesion['id']);
      await this.normalUserService.isNormalUserToEdit(id);
      const resPassword = await this.normalUserService.isTheSamePassword(
        data.clave_acceso,
        id,
      );
      if (resPassword === true) delete data.clave_acceso;
      else {
        const claveEncriptada = await encriptarClave(data.clave_acceso);
        data.clave_acceso = claveEncriptada;
      }
      await this.normalUserService.UpdateNormalUser(id, data);
      return {
        ok: true,
        msg: 'El usuario se actualizo correctamente',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async DeleteNormalUser(@Req() req: Request, @Param('id') id: number) {
    const userSesion = req.user;
    try {
      await this.normalUserService.isAdminOrOwner(userSesion['id']);
      await this.normalUserService.isNormalUserToEdit(id);
      await this.normalUserService.DeleteNormalUser(id);
      return {
        ok: true,
        msg: 'El usuario se elimino correctamente',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
