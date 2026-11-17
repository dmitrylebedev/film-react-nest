import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmsRepository } from '../repository/films.repository';
import {
  CreateOrderDto,
  OrderItemDto,
  OrderResponseDto,
  TicketDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(
    payload: CreateOrderDto | TicketDto[],
  ): Promise<OrderResponseDto> {
    const order = Array.isArray(payload)
      ? { email: '', phone: '', tickets: payload }
      : payload;
    const tickets = order?.tickets;

    if (!tickets?.length) {
      throw new BadRequestException({ error: 'Не переданы билеты' });
    }

    const items: OrderItemDto[] = [];
    const seen = new Set<string>();
    const seatsBySession = new Map<
      string,
      { filmId: string; sessionId: string; seats: string[] }
    >();

    for (const ticket of tickets) {
      if (!ticket?.film || !ticket?.session) {
        throw new BadRequestException({ error: 'Не указан фильм или сеанс' });
      }
      if (!Number.isInteger(ticket.row) || !Number.isInteger(ticket.seat)) {
        throw new BadRequestException({
          error: 'Некорректные координаты кресла',
        });
      }

      const place = `${ticket.row}:${ticket.seat}`;
      const uniqueKey = `${ticket.film}:${ticket.session}:${place}`;
      if (seen.has(uniqueKey)) {
        throw new BadRequestException({ error: 'Место уже занято' });
      }
      seen.add(uniqueKey);

      const film = await this.filmsRepository.findById(ticket.film);
      if (!film) {
        throw new BadRequestException({ error: 'Фильм не найден' });
      }
      const session = film.schedule.find((item) => item.id === ticket.session);
      if (!session) {
        throw new BadRequestException({ error: 'Сеанс не найден' });
      }
      if (
        ticket.row < 1 ||
        ticket.seat < 1 ||
        ticket.row > session.rows ||
        ticket.seat > session.seats
      ) {
        throw new BadRequestException({ error: 'Место вне диапазона зала' });
      }
      if (session.taken.includes(place)) {
        throw new BadRequestException({ error: 'Место уже занято' });
      }

      const groupKey = `${ticket.film}:${ticket.session}`;
      const group = seatsBySession.get(groupKey) ?? {
        filmId: ticket.film,
        sessionId: ticket.session,
        seats: [],
      };
      group.seats.push(place);
      seatsBySession.set(groupKey, group);

      const item = new OrderItemDto();
      item.id = randomUUID();
      item.film = ticket.film;
      item.session = ticket.session;
      item.daytime = ticket.daytime || session.daytime;
      item.row = ticket.row;
      item.seat = ticket.seat;
      item.price = ticket.price ?? session.price;
      items.push(item);
    }

    for (const group of seatsBySession.values()) {
      const saved = await this.filmsRepository.takeSeats(
        group.filmId,
        group.sessionId,
        group.seats,
      );
      if (!saved) {
        throw new BadRequestException({ error: 'Место уже занято' });
      }
    }

    const response = new OrderResponseDto();
    response.total = items.length;
    response.items = items;
    return response;
  }
}
