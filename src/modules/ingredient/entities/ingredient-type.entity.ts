import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IngredientTypeSeafood } from './ingredient-type-seafood.entity';

@Entity({ name: 'ingredient_type' })
export class IngredientType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(
    () => IngredientTypeSeafood,
    (ingredientTypeSeafood) => ingredientTypeSeafood.ingredientType,
  )
  ingredientTypeSeafood: IngredientTypeSeafood[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
