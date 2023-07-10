import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import EventsService from './events.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import CreateEventDTO from './pipes/createEvent.pipe';
import UsersGlobalService from 'src/users/usersGlobal.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('events')
export default class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly usersGlobalService: UsersGlobalService,
  ) {}
  @Get('all/:lugar')
  async GetAllEventsFrom(@Param('lugar') lugar: string) {
    try {
      return await this.eventsService.getAllEventsFrom(lugar);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async GetOneEvent(@Param('id') id: number) {
    try {
      return this.eventsService.getOneEvent(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('imagen'))
  async CreateEvent(
    @Req() req: Request,
    @Body() data: CreateEventDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userSesion = req.user;
    try {
      const isAdminOrOwner = await this.usersGlobalService.canUserCreateEvents(
        userSesion['id'],
      );
      if (!isAdminOrOwner)
        throw new HttpException(
          `No tienes el poder de crear eventos`,
          HttpStatus.CONFLICT,
        );
      if (file) return await this.eventsService.createEvent(data, file.buffer);
      else return await this.eventsService.createEvent(data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('imagen'))
  async UpdateEvent(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() data: CreateEventDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userSesion = req.user;
    try {
      const isAdminOrOwner = await this.usersGlobalService.canUserCreateEvents(
        userSesion['id'],
      );
      if (!isAdminOrOwner)
        throw new HttpException(
          `No tienes el poder de editar eventos`,
          HttpStatus.CONFLICT,
        );
      if (file)
        return await this.eventsService.editEvent(id, data, file.buffer);
      else return await this.eventsService.editEvent(id, data);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async DeleteEvent(@Req() req: Request, @Param('id') id: number) {
    const userSesion = req.user;
    try {
      const isAdminOrOwner = await this.usersGlobalService.canUserCreateEvents(
        userSesion['id'],
      );
      if (!isAdminOrOwner)
        throw new HttpException(
          `No tienes el poder de eliminar eventos`,
          HttpStatus.CONFLICT,
        );
      return await this.eventsService.deleteEvent(id);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
