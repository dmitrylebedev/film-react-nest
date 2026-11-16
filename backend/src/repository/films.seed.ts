import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { FilmDetailsDto } from '../films/dto/films.dto';

export function loadFilmSeed(): FilmDetailsDto[] {
  const filePath = path.join(
    process.cwd(),
    'test',
    'mongodb_initial_stub.json',
  );
  return JSON.parse(readFileSync(filePath, 'utf-8')) as FilmDetailsDto[];
}
