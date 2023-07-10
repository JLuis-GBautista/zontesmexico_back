import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';

@Injectable()
export default class EmailsService {
  constructor(private mailerService: MailerService) {}
  async SendEmailToFormsTwo(
    from: string,
    to: string,
    subject: string,
    html: string,
  ) {
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'jose.bautista500lg@gmail.com',
      },
    });
    transporter.set('oauth2_provision_cb', (user, renew, callback) => {
      console.log(user, renew, callback);
      /*       const accessToken = userTokens[user];
      if (!accessToken) {
        return callback(new Error('Unknown user'));
      } else {
        return callback(null, accessToken);
      } */
    });
    await this.mailerService.sendMail({
      from,
      to,
      subject,
      html,
    });
    return { message: 'mensaje enviado exitosamente' };
  }
}
