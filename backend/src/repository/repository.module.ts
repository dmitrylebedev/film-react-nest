import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { AppConfigModule } from '../app.config.module';
import { AppConfig } from '../app.config.provider';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmsMongoRepository } from './films.mongo.repository';
import { FilmsPostgresRepository } from './films.postgres.repository';
import { FilmsRepository } from './films.repository';

const isPostgres = process.env.DATABASE_DRIVER === 'postgres';

@Module({
  imports: [
    AppConfigModule,
    ...(isPostgres
      ? [
          TypeOrmModule.forRootAsync({
            inject: ['CONFIG'],
            useFactory: (config: AppConfig) => {
              const databaseUrl = new URL(config.database.url);
              return {
                type: 'postgres' as const,
                host: databaseUrl.hostname,
                port: Number(databaseUrl.port || 5432),
                database: databaseUrl.pathname.slice(1),
                username:
                  config.database.username ||
                  decodeURIComponent(databaseUrl.username),
                password:
                  config.database.password ||
                  decodeURIComponent(databaseUrl.password),
                entities: [Film, Schedule],
                synchronize: false,
              };
            },
          }),
          TypeOrmModule.forFeature([Film, Schedule]),
        ]
      : []),
  ],
  providers: [
    ...(isPostgres ? [FilmsPostgresRepository] : [FilmsMongoRepository]),
    {
      provide: FilmsRepository,
      useExisting: isPostgres ? FilmsPostgresRepository : FilmsMongoRepository,
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
