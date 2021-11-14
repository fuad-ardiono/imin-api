import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { UserGuard } from '../../guards/user/user.guard';
import { CreateIngredientStateDto } from './dto/create-ingredient-state.dto';
import { UpdateIngredientStateDto } from './dto/update-ingredient-state.dto';
import { AssignSuperRawIngredientStateDto } from './dto/assign-super-raw-ingredient-state.dto';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { AssignSeafoodIngredientTypeDto } from './dto/assign-seafood-ingredient-type.dto';

@Controller('ingredient')
@UseGuards(UserGuard)
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get('master/super-raw')
  @HttpCode(HttpStatus.OK)
  async masterSuperRaw() {
    return this.ingredientService.listSuperRaw();
  }

  @Get('master/seafood')
  @HttpCode(HttpStatus.OK)
  async masterSeafood() {
    return this.ingredientService.listSeafood();
  }

  @Post('state')
  @HttpCode(HttpStatus.CREATED)
  async createState(
    @Body() createIngredientStateDto: CreateIngredientStateDto,
  ) {
    return this.ingredientService.createIngredientState(
      createIngredientStateDto,
    );
  }

  @Put('state/:id')
  @HttpCode(HttpStatus.OK)
  async updateState(
    @Param('id') id: number,
    @Body() updateIngredientStateDto: UpdateIngredientStateDto,
  ) {
    return this.ingredientService.updateIngredientState(
      id,
      updateIngredientStateDto,
    );
  }

  @Delete('state/:id')
  @HttpCode(HttpStatus.OK)
  async deleteState(@Param('id') id: number) {
    return this.ingredientService.deleteIngredientState(id);
  }

  @Get('state')
  @HttpCode(HttpStatus.OK)
  async indexState() {
    return this.ingredientService.ingredientStateList();
  }

  @Get('state/:id')
  @HttpCode(HttpStatus.OK)
  async detailState(@Param('id') id: number) {
    return this.ingredientService.ingredientStateDetail(id);
  }

  @Post('state/assign')
  @HttpCode(HttpStatus.OK)
  async stateAssignRaw(
    @Body() assignSuperRawIngredientStateDto: AssignSuperRawIngredientStateDto,
  ) {
    return this.ingredientService.assignSuperRawIngredientState(
      assignSuperRawIngredientStateDto,
    );
  }

  @Post('type')
  @HttpCode(HttpStatus.CREATED)
  async createType(@Body() createIngredientTypeDto: CreateIngredientTypeDto) {
    return this.ingredientService.createIngredientType(createIngredientTypeDto);
  }

  @Put('type/:id')
  @HttpCode(HttpStatus.OK)
  async updateType(
    @Param('id') id: number,
    @Body() updateIngredientTypeDto: UpdateIngredientTypeDto,
  ) {
    return this.ingredientService.updateIngredientType(
      id,
      updateIngredientTypeDto,
    );
  }

  @Delete('type/:id')
  @HttpCode(HttpStatus.OK)
  async deleteType(@Param('id') id: number) {
    return this.ingredientService.deleteIngredientType(id);
  }

  @Get('type')
  @HttpCode(HttpStatus.OK)
  async indexType() {
    return this.ingredientService.ingredientTypeList();
  }

  @Get('type/:id')
  @HttpCode(HttpStatus.OK)
  async detailType(@Param('id') id: number) {
    return this.ingredientService.ingredientTypeDetail(id);
  }

  @Post('type/assign')
  @HttpCode(HttpStatus.OK)
  async typeAssignSeafood(
    @Body() assignSeafoodIngredientTypeDto: AssignSeafoodIngredientTypeDto,
  ) {
    return this.ingredientService.assignSeafoodIngredientType(
      assignSeafoodIngredientTypeDto,
    );
  }
}
