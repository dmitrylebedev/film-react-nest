import { Module } from '@nestjs/common';
import { AppConfig } from '../app.config.provider';
import { FilmsMemoryRepository } from './films.memory.repository';
import { FilmsMongoRepository } from './films.mongo.repository';
import { FilmsRepository } from './films.repository';

@Module({
  providers: [
    {
      provide: FilmsRepository,
      useFactory: (config: AppConfig) => {
        if (config.database.driver === 'mongodb') {
          return new FilmsMongoRepository(config);
        }
        return new FilmsMemoryRepository();
      },
      inject: ['CONFIG'],
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
