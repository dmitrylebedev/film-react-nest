import { FilmDetailsDto, FilmDto } from '../films/dto/films.dto';
import { FilmsRepository } from './films.repository';
import { loadFilmSeed } from './films.seed';

export class FilmsMemoryRepository extends FilmsRepository {
  private readonly films: FilmDetailsDto[] = loadFilmSeed();

  async findAll(): Promise<FilmDto[]> {
    return this.films.map((film) => this.toFilmDto(film));
  }

  async findById(id: string): Promise<FilmDetailsDto | null> {
    const film = this.films.find((item) => item.id === id);
    return film ? structuredClone(film) : null;
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

  private toFilmDto(film: FilmDetailsDto): FilmDto {
    const dto = new FilmDto();
    dto.id = film.id;
    dto.rating = film.rating;
    dto.director = film.director;
    dto.tags = [...film.tags];
    dto.title = film.title;
    dto.about = film.about;
    dto.description = film.description;
    dto.image = film.image;
    dto.cover = film.cover;
    return dto;
  }
}
