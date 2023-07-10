import { IsIn, IsString, Length, ValidationArguments } from 'class-validator';

export default class CreateEventDTO {
  @Length(2, 50, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'El titulo es un valor requerido.';
      else if (arg.value.length <= 1)
        return 'El valor "$value" debe contener al menos 2 caracteres.';
      else return 'El valor "$value" debe contener por lo mucho 50 caracteres';
    },
  })
  titulo: string;

  @IsString({ message: 'La descripcion corta debe ser string' })
  descripcion_corta: string;

  @IsString({ message: 'La descripcion larga debe ser string' })
  descripcion_larga: string;

  @Length(2, 255, {
    message: (arg: ValidationArguments) => {
      if (!arg.value) return 'La dirección es un valor requerido.';
      else if (arg.value.length <= 1)
        return 'El valor "$value" debe contener al menos 2 caracteres.';
      else return 'El valor "$value" debe contener por lo mucho 255 caracteres';
    },
  })
  direccion: string;

  @IsString({ message: 'La descripcion larga debe ser string' })
  fecha_hora: string;

  @IsIn(['Ciudad de México', 'Guadalajara', 'Puebla', 'Queretaro'], {
    message: 'El valor del lugar es incorrecto',
  })
  lugar: string;
}
