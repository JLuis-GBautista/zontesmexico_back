import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { BlogsModule } from './blogs/blogs.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailsModule } from './emails/emails.module';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

const capturarAccessToken = async () => {
  try {
    let accessToken = '';
    const clientId = process.env.EMAIL_CLIENT_ID;
    const clientSecret = process.env.EMAIL_CLIENT_SECRET;
    const refresh_token = process.env.EMAIL_REFRESH_TOKEN;
    const oauth2Client = new OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground',
    );
    oauth2Client.setCredentials({
      refresh_token: refresh_token,
    });
    oauth2Client.getAccessToken((err, token) => {
      if (err) console.log(err);
      if (token) accessToken = token;
    });
    return accessToken;
  } catch (error) {
    console.log(error);
    return '';
  }
};
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'),
        username: ConfigService.get('DB_USER'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        retryDelay: 3000,
        synchronize: true,
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (ConfigService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          ignoreTLS: false,
          secure: true,
          auth: {
            type: 'OAuth2',
            user: ConfigService.get<string>('EMAIL_USER'),
            clientId: ConfigService.get<string>('EMAIL_CLIENT_ID'),
            clientSecret: ConfigService.get<string>('EMAIL_CLIENT_SECRET'),
            refreshToken: ConfigService.get<string>('EMAIL_REFRESH_TOKEN'),
            accessToken: await capturarAccessToken(),
          },
        },
      }),
    }),
    UsersModule,
    EventsModule,
    BlogsModule,
    EmailsModule,
  ],
})
export class AppModule {}
