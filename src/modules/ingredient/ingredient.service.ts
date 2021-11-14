import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientState } from './entities/ingredient-state.entity';
import { IsNull, Repository } from 'typeorm';
import { IngredientStateSuperRaw } from './entities/ingredient-state-super-raw.entity';
import { SuperRaw } from './entities/super-raw.entity';
import { IngredientType } from './entities/ingredient-type.entity';
import { IngredientTypeSeafood } from './entities/ingredient-type-seafood.entity';
import { Seafood } from './entities/seafood.entity';
import { CreateIngredientStateDto } from './dto/create-ingredient-state.dto';
import { UpdateIngredientStateDto } from './dto/update-ingredient-state.dto';
import { NotFoundException } from '../../exceptions/notfound.exception';
import { AssignSuperRawIngredientStateDto } from './dto/assign-super-raw-ingredient-state.dto';
import { AppException } from '../../exceptions/app.exception';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientState)
    private readonly ingredientStateRepository: Repository<IngredientState>,

    @InjectRepository(IngredientStateSuperRaw)
    private readonly ingredientStateSuperRawRepository: Repository<IngredientStateSuperRaw>,

    @InjectRepository(SuperRaw)
    private readonly superRawRepository: Repository<SuperRaw>,

    @InjectRepository(IngredientType)
    private readonly ingredientTypeRepository: Repository<IngredientType>,

    @InjectRepository(IngredientTypeSeafood)
    private readonly ingredientTypeSeafood: Repository<IngredientTypeSeafood>,

    @InjectRepository(Seafood)
    private readonly seafoodRepository: Repository<Seafood>,
  ) {}

  async findOneByIdAndDeletedAtIsNullIngredientState(
    id: number,
  ): Promise<IngredientState> {
    return this.ingredientStateRepository.findOne({ id, deletedAt: IsNull() });
  }

  async findOneByIdIngredientState(id: number): Promise<IngredientState> {
    return this.ingredientStateRepository.findOne({ id });
  }

  async findByDeletedAtIsNullIngredientState(): Promise<IngredientState[]> {
    return this.ingredientStateRepository.find({ deletedAt: IsNull() });
  }

  async listSuperRaw(): Promise<SuperRaw[]> {
    return this.superRawRepository.find({ deletedAt: IsNull() });
  }

  async findOneSuperRaw(id: number): Promise<SuperRaw> {
    return this.superRawRepository.findOne({ id });
  }

  async listSeafood(): Promise<Seafood[]> {
    return this.seafoodRepository.find({ deletedAt: IsNull() });
  }

  async createIngredientState(
    createIngredientStateDto: CreateIngredientStateDto,
  ): Promise<IngredientState> {
    const newIngredientState = Object.assign(
      new IngredientState(),
      createIngredientStateDto,
    );

    return this.ingredientStateRepository.save(newIngredientState);
  }

  async updateIngredientState(
    id: number,
    updateIngredientStateDto: UpdateIngredientStateDto,
  ): Promise<IngredientState> {
    const ingredientStateRecord =
      await this.findOneByIdAndDeletedAtIsNullIngredientState(id);

    if (!ingredientStateRecord) {
      throw new NotFoundException('ingredient state not found');
    }

    const updateIngredientState = Object.assign(
      ingredientStateRecord,
      updateIngredientStateDto,
    );

    await this.ingredientStateRepository.update({ id }, updateIngredientState);

    return this.findOneByIdAndDeletedAtIsNullIngredientState(id);
  }

  async deleteIngredientState(id: number): Promise<IngredientState> {
    const ingredientStateRecord =
      await this.findOneByIdAndDeletedAtIsNullIngredientState(id);

    if (!ingredientStateRecord) {
      throw new NotFoundException('ingredient state not found');
    }

    ingredientStateRecord.deletedAt = new Date();

    await this.ingredientStateRepository.update({ id }, ingredientStateRecord);

    return this.findOneByIdIngredientState(id);
  }

  async ingredientStateDetail(id: number): Promise<IngredientState> {
    const ingredientStateRecord = await this.ingredientStateRepository.findOne({
      relations: ['ingredientSuperRaw'],
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!ingredientStateRecord) {
      throw new NotFoundException('ingredient state not found');
    }

    return ingredientStateRecord;
  }

  async ingredientStateList(): Promise<IngredientState[]> {
    return this.findByDeletedAtIsNullIngredientState();
  }

  async assignSuperRawIngredientState(
    assignSuperRawIngredientStateDto: AssignSuperRawIngredientStateDto,
  ): Promise<IngredientState> {
    const superRawListPromises = [];

    assignSuperRawIngredientStateDto.superRawIds.forEach((superRawId) => {
      superRawListPromises.push(this.findOneSuperRaw(superRawId));
    });

    const superRawList: SuperRaw[] = await Promise.all(superRawListPromises);

    const nullSuperRawList = superRawList.filter((obj) => {
      return obj == null || false;
    });

    if (nullSuperRawList.length > 0) {
      throw new AppException('invalid super raw record');
    }

    const ingredientStateRecord =
      await this.findOneByIdAndDeletedAtIsNullIngredientState(
        assignSuperRawIngredientStateDto.ingredientStateId,
      );

    if (!ingredientStateRecord) {
      throw new AppException('invalid ingredient state');
    }

    superRawList.forEach((superRaw) => {
      const ingredientStateSuperRaw = new IngredientStateSuperRaw();
      ingredientStateSuperRaw.ingredientState = ingredientStateRecord;
      ingredientStateSuperRaw.superRaw = superRaw;

      this.ingredientStateSuperRawRepository.save(ingredientStateSuperRaw);
    });

    return this.ingredientStateRepository.findOne({
      relations: ['ingredientSuperRaw'],
      where: {
        id: assignSuperRawIngredientStateDto.ingredientStateId,
        deletedAt: IsNull(),
      },
    });
  }
}
