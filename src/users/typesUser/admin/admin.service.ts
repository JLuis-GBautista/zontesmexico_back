import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compararClaves, encriptarClave } from 'src/users/auth/libs/bcrypt';
import Users from 'src/users/entities/user.entity';
import CreateUserDTO from 'src/users/pipes/createUser.pipe';
import {
  UpdateOthersUserDTO,
  UpdatePersonalUserDTO,
} from 'src/users/pipes/editUser.pipe';
import { Repository } from 'typeorm';

@Injectable()
export default class AdminService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
  ) {}
  async isOwner(id: number) {
    const requiredRole = 'Propietario';
    const user = await this.UsersRepository.findOneBy({
      id,
    });
    if (user.tipo_usuario !== requiredRole)
      throw new HttpException(
        `No tienes el poder de crear o editar un administrador`,
        HttpStatus.CONFLICT,
      );
    return;
  }

  async isAdminUserToEdit(id: number) {
    const assignedRole = 'Administrador';
    const user = await this.UsersRepository.findOneBy({
      id,
    });
    if (user.tipo_usuario !== assignedRole)
      throw new HttpException(
        `En este controlador solo puedes editar o eliminar Administradores`,
        HttpStatus.CONFLICT,
      );
  }

  async RegisterAdmin(data: CreateUserDTO) {
    const usuario = data;
    const existUser = await this.UsersRepository.findOne({
      where: { correo: data.correo },
      select: ['correo'],
    });
    if (existUser)
      throw new HttpException(
        `El correo ${existUser.correo} ya esta registrado`,
        HttpStatus.CONFLICT,
      );
    const assignedRole = 'Administrador';
    const claveEncriptada = await encriptarClave(data.clave_acceso);
    usuario.clave_acceso = claveEncriptada;
    usuario['tipo_usuario'] = assignedRole;
    const user = this.UsersRepository.create(usuario);
    await this.UsersRepository.save(user);
    return;
  }

  async isTheSamePassword(newPass: string, id: number) {
    const user = await this.UsersRepository.findOneBy({ id });
    const passwordIsMatch = await compararClaves(newPass, user.clave_acceso);
    if (passwordIsMatch === true) return true;
    else return false;
  }

  async UpdatePersonAdmin(id: number, data: UpdatePersonalUserDTO) {
    const assignedRole = 'Administrador';
    const user = await this.UsersRepository.findOneBy({
      id,
    });
    if (user.tipo_usuario !== assignedRole)
      throw new HttpException(
        `Este controlador no es para ti`,
        HttpStatus.CONFLICT,
      );
    await this.UsersRepository.update({ id }, data);
    return;
  }

  async UpdateAdmin(id: number, data: UpdateOthersUserDTO) {
    const existEmail = await this.UsersRepository.findOneBy({
      correo: data.correo,
    });
    if (existEmail && existEmail.id !== id)
      throw new HttpException(
        `El correo ${data.correo} ya lo tiene otro usuario`,
        HttpStatus.CONFLICT,
      );
    else if (existEmail && existEmail.id === id) delete data.correo;
    await this.UsersRepository.update({ id }, data);
    return;
  }

  async DeleteAdmin(id: number) {
    await this.UsersRepository.delete({ id });
    return;
  }
}
