import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Users from './entities/user.entity';
import { Repository } from 'typeorm';
import { compararClaves } from './auth/libs/bcrypt';
import LoginUserDTO from './pipes/loginUser.pipe';

@Injectable()
export default class UsersGlobalService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
  ) {}
  // -------------- Servicios para controladores de usuario -------------------
  async Login(data: LoginUserDTO) {
    const usuario = await this.UsersRepository.findOne({
      where: { correo: data.correo },
    });
    if (!usuario)
      throw new HttpException('Error de credenciales', HttpStatus.CONFLICT);
    let claveVerdadera = true;
    if (usuario.tipo_usuario !== 'Propietario')
      claveVerdadera = await compararClaves(
        data.clave_acceso,
        usuario.clave_acceso,
      );
    if (claveVerdadera === false)
      throw new HttpException('Error de credenciales', HttpStatus.CONFLICT);
    return usuario;
  }

  async Session(id: number) {
    const usuario = await this.UsersRepository.findOne({
      where: { id },
    });
    if (!usuario)
      throw new HttpException('Error de sesion', HttpStatus.NOT_FOUND);
    return usuario;
  }
}
