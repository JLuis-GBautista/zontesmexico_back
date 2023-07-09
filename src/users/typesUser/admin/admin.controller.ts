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
import AdminService from './admin.service';
import CreateUserDTO from 'src/users/pipes/createUser.pipe';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import UsersGlobalService from 'src/users/usersGlobal.service';
import { UpdatePersonalUserDTO } from 'src/users/pipes/editUser.pipe';
import { encriptarClave } from 'src/users/auth/libs/bcrypt';

@Controller('admin')
export default class adminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly sesionService: UsersGlobalService,
  ) {}
  @Post('register')
  @UseGuards(AuthGuard('jwt'))
  async AdminRegister(@Body() data: CreateUserDTO, @Req() req: Request) {
    const userSesion = req.user;
    try {
      await this.adminService.isOwner(userSesion['id']);
      await this.adminService.RegisterAdmin(data);
      return { ok: true, message: 'usuario Administrador creado exitosamente' };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('person_update')
  @UseGuards(AuthGuard('jwt'))
  async UpdatePersonAdmin(
    @Body() data: UpdatePersonalUserDTO,
    @Req() req: Request,
  ) {
    const userSesion = req.user;
    try {
      await this.adminService.UpdatePersonAdmin(userSesion['id'], data);
      return await this.sesionService.Session(userSesion['id']);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  async UpdateAdmins(
    @Body() data: CreateUserDTO,
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    const userSesion = req.user;
    try {
      await this.adminService.isOwner(userSesion['id']);
      await this.adminService.isAdminUserToEdit(id);
      const resPassword = await this.adminService.isTheSamePassword(
        data.clave_acceso,
        id,
      );
      if (resPassword === true) delete data.clave_acceso;
      else {
        const claveEncriptada = await encriptarClave(data.clave_acceso);
        data.clave_acceso = claveEncriptada;
      }
      await this.adminService.UpdateAdmin(id, data);
      return {
        ok: true,
        msg: 'El usuario Administrador se actualizo correctamente',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async DeleteAdmin(@Req() req: Request, @Param('id') id: number) {
    const userSesion = req.user;
    try {
      await this.adminService.isOwner(userSesion['id']);
      await this.adminService.DeleteAdmin(id);
      return {
        ok: true,
        msg: 'El usuario Administrador se elimino correctamente',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
