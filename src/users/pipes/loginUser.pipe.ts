import { PickType } from '@nestjs/mapped-types';
import CreateUserDTO from './createUser.pipe';

export default class LoginUserDTO extends PickType(CreateUserDTO, [
  'correo',
  'clave_acceso',
] as const) {}
