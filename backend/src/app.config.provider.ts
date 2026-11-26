import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver:
        configService.get<AppConfigDatabaseDriver>('DATABASE_DRIVER') ??
        'mongodb',
      url: configService.get<string>('DATABASE_URL') ?? '',
      username: configService.get<string>('DATABASE_USERNAME') ?? '',
      password: configService.get<string>('DATABASE_PASSWORD') ?? '',
    },
  }),
  inject: [ConfigService],
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: AppConfigDatabaseDriver;
  url: string;
  username: string;
  password: string;
}

export type AppConfigDatabaseDriver = 'mongodb' | 'postgres';
