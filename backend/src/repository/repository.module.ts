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
            useFactory: (config: AppConfig) => ({
              type: 'postgres' as const,
              url: config.database.url,
              username: config.database.username,
              password: config.database.password,
              entities: [Film, Schedule],
              synchronize: false,
            }),
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
