import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class EmailsService {
  constructor(private mailerService: MailerService) {}
  async SendEmailToFormsTwo(to: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
    return { message: 'mensaje enviado exitosamente' };
  }
}
