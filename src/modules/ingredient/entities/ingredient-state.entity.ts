import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IngredientStateSuperRaw } from './ingredient-state-super-raw.entity';

@Entity({ name: 'ingredient_state' })
export class IngredientState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(
    () => IngredientStateSuperRaw,
    (ingredientSuperRaw) => ingredientSuperRaw.ingredientState,
  )
  ingredientSuperRaw: IngredientStateSuperRaw[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
