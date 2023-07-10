import { Body, Controller, HttpException, Post } from '@nestjs/common';
import EmailsService from './emails.service';

@Controller('email')
export default class EventsController {
  constructor(private emailsService: EmailsService) {}
  @Post('enviar')
  async SendForm1y2(@Body() data: any) {
    try {
      return await this.emailsService.SendEmailToFormsTwo(
        data.from,
        data.to,
        data.subject,
        data.html,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
