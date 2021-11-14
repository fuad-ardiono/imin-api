import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IngredientType } from './ingredient-type.entity';
import { Seafood } from './seafood.entity';

@Entity({ name: 'ingredient_type_seafood' })
export class IngredientTypeSeafood {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => IngredientType, (ingredientType) => ingredientType.id)
  @JoinColumn({ name: 'ingredient_type_id' })
  ingredientType: IngredientType;

  @ManyToOne(() => Seafood, (seafood) => seafood.id)
  @JoinColumn({ name: 'seafood_id' })
  seafood: Seafood;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}
