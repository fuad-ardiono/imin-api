import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MeasurementUnit } from '../../measurement-unit/entities/measurement-unit.entity';
import { IngredientState } from './ingredient-state.entity';
import { IngredientType } from './ingredient-type.entity';

@Entity({ name: 'ingredient' })
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToOne(() => MeasurementUnit)
  @JoinColumn({ name: 'measurement_unit_id' })
  measurementUnit: MeasurementUnit;

  @OneToOne(() => IngredientState)
  @JoinColumn({ name: 'ingredient_state_id' })
  ingredientState: IngredientState;

  @OneToOne(() => IngredientType)
  @JoinColumn({ name: 'ingredient_type_id' })
  ingredientType: IngredientType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
