import { FilmDetailsDto, FilmDto } from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;

  abstract findById(id: string): Promise<FilmDetailsDto | null>;

  abstract takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean>;
}
