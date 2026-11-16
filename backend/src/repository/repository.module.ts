import { Module } from '@nestjs/common';
import { FilmsMemoryRepository } from './films.memory.repository';
import { FilmsRepository } from './films.repository';

@Module({
  providers: [
    {
      provide: FilmsRepository,
      useFactory: () => new FilmsMemoryRepository(),
    },
  ],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
