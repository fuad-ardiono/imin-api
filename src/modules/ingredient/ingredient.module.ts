import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientState } from './entities/ingredient-state.entity';
import { IngredientStateSuperRaw } from './entities/ingredient-state-super-raw.entity';
import { SuperRaw } from './entities/super-raw.entity';
import { IngredientType } from './entities/ingredient-type.entity';
import { IngredientTypeSeafood } from './entities/ingredient-type-seafood.entity';
import { Seafood } from './entities/seafood.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IngredientState,
      IngredientStateSuperRaw,
      SuperRaw,
      IngredientType,
      IngredientTypeSeafood,
      Seafood,
    ]),
  ],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
