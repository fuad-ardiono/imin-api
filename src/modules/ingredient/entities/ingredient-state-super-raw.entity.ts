import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SuperRaw } from './super-raw.entity';
import { IngredientState } from './ingredient-state.entity';

@Entity({ name: 'ingredient_state_super_raw' })
export class IngredientStateSuperRaw {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => IngredientState, (ingredientState) => ingredientState.id)
  @JoinColumn({ name: 'ingredient_state_id' })
  ingredientState: IngredientState;

  @ManyToOne(() => SuperRaw, (superRaw) => superRaw.id)
  @JoinColumn({ name: 'super_raw_id' })
  superRaw: SuperRaw;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
