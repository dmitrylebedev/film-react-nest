import { Injectable } from '@nestjs/common';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  async findAll(): Promise<FilmsResponseDto> {
    const response = new FilmsResponseDto();
    response.total = 0;
    response.items = [];
    return response;
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    void id;
    const response = new ScheduleResponseDto();
    response.total = 0;
    response.items = [];
    return response;
  }
}
