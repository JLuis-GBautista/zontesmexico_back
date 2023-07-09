import {
  Length,
  ValidationArguments,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export default class CreateUserDTO {
  @Length(2, 100, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El nombre es un valor requerido.';
      else if (arg.value.length <= 1)
        return 'El valor "$value" debe contener al menos 2 caracteres.';
      else return 'El valor "$value" debe contener por lo mucho 100 caracteres';
    },
  })
  nombre_completo: string;

  @Length(2, 20, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El nombre de usuario es un valor requerido.';
      else if (arg.value.length <= 1)
        return 'El valor "$value" debe contener al menos 2 caracteres.';
      else return 'El valor "$value" debe contener por lo mucho 20 caracteres';
    },
  })
  nombre_usuario: string;

  @Length(10, 10, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El telefono es un valor requerido.';
      else if (arg.value.length <= 1)
        return 'El valor "$value" debe contener al menos 10 caracteres.';
      else return 'El valor "$value" debe contener por lo mucho 10 caracteres';
    },
  })
  telefono: string;

  @IsEmail(undefined, {
    message: 'El valor "$value" debe ser un correo electronico',
  })
  correo: string;
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 2,
    },
    {
      message:
        'La Contraseña debe contener 1 letra Mayuscula, 2 letras Minusculas, 1 Simbolo, 1 Numero, y debe contener 8 caracteres',
    },
  )
  clave_acceso: string;
}
