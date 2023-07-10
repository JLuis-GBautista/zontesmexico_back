import { Module } from '@nestjs/common';
import EmailsService from './emails.service';
import EmailsController from './emails.controller';

@Module({
  imports: [],
  controllers: [EmailsController],
  providers: [EmailsService],
})
export class EmailsModule {}
