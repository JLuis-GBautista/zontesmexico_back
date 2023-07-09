import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controladores y Servicios que funcionaran independientemente del tipo de usuario
import UsersGlobalService from './usersGlobal.service';
import UsersGlobalController from './usersGlobal.controller';

// Asignacion  de modelo e integracion del modulo del token
import Users from './entities/user.entity';
import { TokenModule } from './auth/token.module';
import AdminService from './typesUser/admin/admin.service';
import NormalUserService from './typesUser/comun/comun.service';
import adminController from './typesUser/admin/admin.controller';
import NormalUserController from './typesUser/comun/comun.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), TokenModule],
  controllers: [UsersGlobalController, adminController, NormalUserController],
  providers: [UsersGlobalService, AdminService, NormalUserService],
  exports: [UsersGlobalService, AdminService, NormalUserService],
})
export class UsersModule {}
