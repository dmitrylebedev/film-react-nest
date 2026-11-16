import { FilmDetailsDto, FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmEntity, ScheduleEntity } from './schemas/film.schema';

export function toScheduleEntity(dto: ScheduleDto): ScheduleEntity {
  return {
    id: dto.id,
    daytime: dto.daytime,
    hall: dto.hall,
    rows: dto.rows,
    seats: dto.seats,
    price: dto.price,
    taken: [...(dto.taken ?? [])],
  };
}

export function toFilmEntity(dto: FilmDetailsDto): FilmEntity {
  return {
    id: dto.id,
    rating: dto.rating,
    director: dto.director,
    tags: [...(dto.tags ?? [])],
    title: dto.title,
    about: dto.about,
    description: dto.description,
    image: dto.image,
    cover: dto.cover,
    schedule: (dto.schedule ?? []).map((session) => toScheduleEntity(session)),
  };
}

export function toFilmDto(entity: FilmEntity): FilmDto {
  const dto = new FilmDto();
  dto.id = entity.id;
  dto.rating = entity.rating;
  dto.director = entity.director;
  dto.tags = [...(entity.tags ?? [])];
  dto.title = entity.title;
  dto.about = entity.about;
  dto.description = entity.description;
  dto.image = entity.image;
  dto.cover = entity.cover;
  return dto;
}

export function toScheduleDto(entity: ScheduleEntity): ScheduleDto {
  const dto = new ScheduleDto();
  dto.id = entity.id;
  dto.daytime = entity.daytime;
  dto.hall = entity.hall;
  dto.rows = entity.rows;
  dto.seats = entity.seats;
  dto.price = entity.price;
  dto.taken = [...(entity.taken ?? [])];
  return dto;
}

export function toFilmDetailsDto(entity: FilmEntity): FilmDetailsDto {
  const dto = Object.assign(new FilmDetailsDto(), toFilmDto(entity));
  dto.schedule = (entity.schedule ?? []).map((session) =>
    toScheduleDto(session),
  );
  return dto;
}
