import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export default class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  nombre_completo: string;

  @Column('varchar', { length: 20 })
  nombre_usuario: string;

  @Column('varchar', { length: 20 })
  telefono: string;

  @Column('varchar', { unique: true })
  correo: string;

  @Column('varchar')
  clave_acceso: string;

  @Column({
    type: 'enum',
    enum: ['Común', 'Administrador', 'Propietario'],
    default: 'Común',
  })
  tipo_usuario: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_edicion: Date;
}
