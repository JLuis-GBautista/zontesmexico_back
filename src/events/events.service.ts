import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Events from './entities/event.entity';
import { Repository } from 'typeorm';
import CreateEventDTO from './pipes/createEvent.pipe';

@Injectable()
export default class EventsService {
  constructor(
    @InjectRepository(Events)
    private readonly EventRepository: Repository<Events>,
  ) {}
  async existEvent(id: number) {
    const existEvent = this.EventRepository.findOneBy({ id });
    if (existEvent) return true;
    else return false;
  }

  async existTitleFromEvent(titulo: string) {
    const existTitle = await this.EventRepository.findOneBy({
      titulo,
    });
    if (existTitle) return true;
    else return false;
  }

  async getAllEventsFrom(lugar: string) {
    return await this.EventRepository.find({
      where: {
        lugar,
      },
      order: {
        fecha_hora: 'DESC',
      },
    });
  }

  async getOneEvent(id: number) {
    return await this.EventRepository.findOneBy({ id });
  }

  async createEvent(data: CreateEventDTO, img?: Buffer) {
    const existTitle = await this.existTitleFromEvent(data.titulo);
    if (existTitle)
      throw new HttpException(
        `Ya existe un evento con ese titulo`,
        HttpStatus.CONFLICT,
      );
    if (img) data['imagen'] = img;
    const event = this.EventRepository.create(data);
    return await this.EventRepository.save(event);
  }

  async editEvent(id: number, data: CreateEventDTO, img?: Buffer) {
    const existEvent = await this.existEvent(id);
    if (!existEvent)
      throw new HttpException(
        `No existe el evento que quieres editar`,
        HttpStatus.CONFLICT,
      );
    const existTitle = await this.EventRepository.findOneBy({
      titulo: data.titulo,
    });
    if (existTitle && existTitle.id !== id)
      throw new HttpException(
        `Ya existe un evento con ese titulo`,
        HttpStatus.CONFLICT,
      );
    if (existTitle && existTitle.id === id) delete data.titulo;
    if (img) data['imagen'] = img;
    await this.EventRepository.update({ id }, data);
    return;
  }

  async deleteEvent(id: number) {
    const existEvent = await this.existEvent(id);
    if (!existEvent)
      throw new HttpException(
        `No existe el evento que quieres eliminar`,
        HttpStatus.CONFLICT,
      );
    await this.EventRepository.delete({ id });
    return;
  }
}
