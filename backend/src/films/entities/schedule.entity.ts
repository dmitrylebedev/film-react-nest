import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column('integer')
  hall: number;

  @Column('integer')
  rows: number;

  @Column('integer')
  seats: number;

  @Column('double precision')
  price: number;

  @Column('simple-array', { default: '' })
  taken: string[];

  @Column('uuid', { nullable: true })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
