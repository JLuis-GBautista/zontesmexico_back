import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'eventos' })
export default class Blogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, unique: true })
  titulo: string;

  @Column('bytea')
  imagen: Buffer;

  @Column('text')
  descripcion_corta: string;

  @Column('text')
  descripcion_larga: string;

  @Column('varchar', { length: 255 })
  direccion: string;

  @Column('timestamp')
  fecha_hora: Date;

  @Column({
    type: 'enum',
    enum: ['Ciudad de México', 'Guadalajara', 'Puebla', 'Queretaro'],
    default: 'Ciudad de México',
  })
  lugar: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_edicion: Date;
}
