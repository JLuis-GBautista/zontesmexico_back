import { Module } from '@nestjs/common';
import EventsService from './events.service';
import EventsController from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Events from './entities/event.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Events]), UsersModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
