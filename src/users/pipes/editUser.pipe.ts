import { PickType } from '@nestjs/mapped-types';
import CreateUserDTO from './createUser.pipe';

export class UpdatePersonalUserDTO extends PickType(CreateUserDTO, [
  'nombre_usuario',
  'telefono',
] as const) {}

export class UpdateOthersUserDTO extends CreateUserDTO {}
