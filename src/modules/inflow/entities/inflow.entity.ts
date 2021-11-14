import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';

export enum InflowReason {
  PURCHASE = 'PURCHASE',
  RECOUNT = 'RECOUNT',
}

@Entity({ name: 'inflow' })
export class Inflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: number;

  @Column({ name: 'input_date' })
  inputDate: Date;

  @Column({
    name: 'reason',
    type: 'enum',
    enum: InflowReason,
    default: InflowReason.PURCHASE,
  })
  reason: InflowReason;

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @OneToOne(() => Ingredient)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;

  @Column({ name: 'notes' })
  notes: string;
}
