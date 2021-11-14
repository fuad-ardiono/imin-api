import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientStateDto } from './create-ingredient-state.dto';

export class UpdateIngredientStateDto extends PartialType(
  CreateIngredientStateDto,
) {}
