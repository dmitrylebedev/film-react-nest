import {
  Model,
  model,
  models,
  connect,
  connection,
  disconnect,
} from 'mongoose';
import { AppConfig } from '../app.config.provider';
import { FilmDetailsDto, FilmDto } from '../films/dto/films.dto';
import { toFilmDetailsDto, toFilmDto } from '../films/films.mapper';
import { FilmEntity, FilmSchema } from '../films/schemas/film.schema';
import { FilmsRepository } from './films.repository';
import { loadFilmSeed } from './films.seed';

const FILM_MODEL = 'Film';

export class FilmsMongoRepository extends FilmsRepository {
  private filmModel: Model<FilmEntity>;
  private readonly ready: Promise<void>;

  constructor(private readonly config: AppConfig) {
    super();
    this.ready = this.connect();
  }

  async findAll(): Promise<FilmDto[]> {
    await this.ready;
    const films = await this.filmModel.find().lean<FilmEntity[]>().exec();
    return films.map((film) => toFilmDto(film));
  }

  async findById(id: string): Promise<FilmDetailsDto | null> {
    await this.ready;
    const film = await this.filmModel.findOne({ id }).lean<FilmEntity>().exec();
    return film ? toFilmDetailsDto(film) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    await this.ready;
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            taken: { $nin: seats },
          },
        },
      },
      {
        $addToSet: {
          'schedule.$.taken': { $each: seats },
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async onModuleDestroy() {
    if (connection.readyState !== 0) {
      await disconnect();
    }
  }

  private async connect() {
    if (!this.config.database.url) {
      throw new Error('DATABASE_URL is not set');
    }
    if (connection.readyState === 0) {
      await connect(this.config.database.url);
    }
    this.filmModel =
      (models[FILM_MODEL] as Model<FilmEntity>) ??
      model<FilmEntity>(FILM_MODEL, FilmSchema, 'films');
    await this.seedIfEmpty();
  }

  private async seedIfEmpty() {
    const count = await this.filmModel.countDocuments();
    if (count > 0) {
      return;
    }
    await this.filmModel.insertMany(loadFilmSeed());
  }
}
