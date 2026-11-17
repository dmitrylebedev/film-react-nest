import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { FilmDetailsDto } from '../films/dto/films.dto';
import { toFilmEntity } from '../films/films.mapper';
import { FilmEntity } from '../films/schemas/film.schema';

export function loadFilmSeed(): FilmEntity[] {
  const filePath = path.join(
    process.cwd(),
    'test',
    'mongodb_initial_stub.json',
  );
  const parsed = JSON.parse(
    readFileSync(filePath, 'utf-8'),
  ) as FilmDetailsDto[];
  return parsed.map((film) => toFilmEntity(film));
}
