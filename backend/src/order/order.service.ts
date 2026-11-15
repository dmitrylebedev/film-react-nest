import { Injectable } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto, TicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  async create(
    payload: CreateOrderDto | TicketDto[],
  ): Promise<OrderResponseDto> {
    void payload;
    const response = new OrderResponseDto();
    response.total = 0;
    response.items = [];
    return response;
  }
}
