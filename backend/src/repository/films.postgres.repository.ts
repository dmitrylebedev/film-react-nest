import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilmDetailsDto, FilmDto } from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { toFilmDetailsDto, toFilmDto } from '../films/films.mapper';
import { FilmsRepository } from './films.repository';

@Injectable()
export class FilmsPostgresRepository extends FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.films.find();
    return films.map((film) => toFilmDto(film));
  }

  async findById(id: string): Promise<FilmDetailsDto | null> {
    const film = await this.films.findOne({
      where: { id },
      relations: { schedule: true },
    });
    return film ? toFilmDetailsDto(film) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    return this.dataSource.transaction(async (entityManager) => {
      const schedules = entityManager.getRepository(Schedule);
      const session = await schedules.findOne({
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!session || seats.some((seat) => session.taken.includes(seat))) {
        return false;
      }

      session.taken = [...session.taken, ...seats];
      await schedules.save(session);
      return true;
    });
  }
}
