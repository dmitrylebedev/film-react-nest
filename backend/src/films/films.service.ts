import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmsResponseDto> {
    const items = await this.filmsRepository.findAll();
    const response = new FilmsResponseDto();
    response.total = items.length;
    response.items = items;
    return response;
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException({ error: 'Фильм не найден' });
    }
    const response = new ScheduleResponseDto();
    response.total = film.schedule.length;
    response.items = film.schedule;
    return response;
  }
}
