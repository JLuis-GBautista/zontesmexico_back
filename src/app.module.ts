import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { BlogsModule } from './blogs/blogs.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailsModule } from './emails/emails.module';

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
      useFactory: () => ({
        transport: {
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          ignoreTLS: false,
          secure: true,
          auth: {
            clientId:
              '157965941596-1m8rtefo4b4ld1m31fqlt5uuh7pith5c.apps.googleusercontent.com',
            clientSecret: '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',
            type: 'OAUTH2',
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          secureOptions: 'TLSv1_2_method',
        },
        defaults: {
          from: process.env.EMAIL_USER,
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
