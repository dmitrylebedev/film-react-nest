import { FilmDetailsDto, FilmDto } from '../films/dto/films.dto';
import { toFilmDetailsDto, toFilmDto } from '../films/films.mapper';
import { FilmEntity } from '../films/schemas/film.schema';
import { FilmsRepository } from './films.repository';
import { loadFilmSeed } from './films.seed';

export class FilmsMemoryRepository extends FilmsRepository {
  private readonly films: FilmEntity[] = loadFilmSeed();

  async findAll(): Promise<FilmDto[]> {
    return this.films.map((film) => toFilmDto(film));
  }

  async findById(id: string): Promise<FilmDetailsDto | null> {
    const film = this.films.find((item) => item.id === id);
    return film ? toFilmDetailsDto(film) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const film = this.films.find((item) => item.id === filmId);
    const session = film?.schedule.find((item) => item.id === sessionId);
    if (!session) {
      return false;
    }
    if (seats.some((seat) => session.taken.includes(seat))) {
      return false;
    }
    session.taken.push(...seats);
    return true;
  }
}
