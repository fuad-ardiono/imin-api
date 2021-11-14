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
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { AssignSeafoodIngredientTypeDto } from './dto/assign-seafood-ingredient-type.dto';

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
    return this.ingredientStateRepository.find({
      relations: ['ingredientSuperRaw'],
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async findOneByIdAndDeletedAtIsNullIngredientType(
    id: number,
  ): Promise<IngredientType> {
    return this.ingredientTypeRepository.findOne({ id, deletedAt: IsNull() });
  }

  async findByDeletedAtIsNullIngredientType(): Promise<IngredientType[]> {
    return this.ingredientTypeRepository.find({
      relations: ['ingredientTypeSeafood'],
      where: {
        deletedAt: IsNull(),
      },
    });
  }

  async findOneByIdIngredientType(id: number): Promise<IngredientType> {
    return this.ingredientTypeRepository.findOne({ id });
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

  async findOneSeafood(id: number): Promise<SuperRaw> {
    return this.superRawRepository.findOne({ id });
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
      relations: ['ingredientSuperRaw', 'ingredientSuperRaw.superRaw'],
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
      throw new AppException('invalid super raw');
    }

    const ingredientStateRecord =
      await this.findOneByIdAndDeletedAtIsNullIngredientState(
        assignSuperRawIngredientStateDto.ingredientStateId,
      );

    if (!ingredientStateRecord) {
      throw new AppException('invalid ingredient state');
    }

    const ingredientStateSuperRawPromises = [];
    superRawList.forEach((superRaw) => {
      const ingredientStateSuperRaw = new IngredientStateSuperRaw();
      ingredientStateSuperRaw.ingredientState = ingredientStateRecord;
      ingredientStateSuperRaw.superRaw = superRaw;

      ingredientStateSuperRawPromises.push(
        this.ingredientStateSuperRawRepository.save(ingredientStateSuperRaw),
      );
    });

    await Promise.all(ingredientStateSuperRawPromises);

    return this.ingredientStateRepository.findOne({
      relations: ['ingredientSuperRaw', 'ingredientSuperRaw.superRaw'],
      where: {
        id: assignSuperRawIngredientStateDto.ingredientStateId,
        deletedAt: IsNull(),
      },
    });
  }

  async createIngredientType(
    createIngredientTypeDto: CreateIngredientTypeDto,
  ): Promise<IngredientType> {
    const newIngredientType = Object.assign(
      new IngredientType(),
      createIngredientTypeDto,
    );

    return this.ingredientTypeRepository.save(newIngredientType);
  }

  async updateIngredientType(
    id: number,
    updateIngredientTypeDto: UpdateIngredientTypeDto,
  ): Promise<IngredientType> {
    const ingredientTypeRecord =
      await this.findOneByIdAndDeletedAtIsNullIngredientType(id);

    if (!ingredientTypeRecord) {
      throw new NotFoundException('ingredient type not found');
    }

    const updateIngredientType = Object.assign(
      ingredientTypeRecord,
      updateIngredientTypeDto,
    );

    await this.ingredientTypeRepository.update({ id }, updateIngredientType);

    return this.findOneByIdAndDeletedAtIsNullIngredientType(id);
  }

  async deleteIngredientType(id: number): Promise<IngredientType> {
    const ingredientTypeRecord =
      await this.findOneByIdAndDeletedAtIsNullIngredientType(id);

    if (!ingredientTypeRecord) {
      throw new NotFoundException('ingredient type not found');
    }

    ingredientTypeRecord.deletedAt = new Date();

    await this.ingredientTypeRepository.update({ id }, ingredientTypeRecord);

    return this.findOneByIdIngredientType(id);
  }

  async ingredientTypeDetail(id: number): Promise<IngredientType> {
    const ingredientTypeRecord = await this.ingredientTypeRepository.findOne({
      relations: ['ingredientTypeSeafood', 'ingredientTypeSeafood.seafood'],
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!ingredientTypeRecord) {
      throw new NotFoundException('ingredient type not found');
    }

    return ingredientTypeRecord;
  }

  async ingredientTypeList(): Promise<IngredientType[]> {
    return this.findByDeletedAtIsNullIngredientType();
  }

  async assignSeafoodIngredientType(
    assignSeafoodIngredientTypeDto: AssignSeafoodIngredientTypeDto,
  ): Promise<IngredientType> {
    const seafoodPromises = [];

    assignSeafoodIngredientTypeDto.seafoodIds.forEach((seafoodId) => {
      seafoodPromises.push(this.findOneSeafood(seafoodId));
    });

    const seafoodList: Seafood[] = await Promise.all(seafoodPromises);

    const nullSeafoodList = seafoodList.filter((seafood) => {
      return seafood == null || false;
    });

    if (nullSeafoodList.length > 0) {
      throw new AppException('invalid seafood');
    }

    const ingredientTypeRecord =
      await this.findOneByIdAndDeletedAtIsNullIngredientType(
        assignSeafoodIngredientTypeDto.ingredientTypeId,
      );

    if (!ingredientTypeRecord) {
      throw new AppException('invalid ingredient type');
    }

    const ingredientTypeSeafoodPromises = [];
    seafoodList.forEach((seafood) => {
      const newIngredientTypeSeafood = new IngredientTypeSeafood();
      newIngredientTypeSeafood.ingredientType = ingredientTypeRecord;
      newIngredientTypeSeafood.seafood = seafood;

      ingredientTypeSeafoodPromises.push(
        this.ingredientTypeSeafood.save(newIngredientTypeSeafood),
      );
    });

    await Promise.all(ingredientTypeSeafoodPromises);

    return this.ingredientTypeRepository.findOne({
      relations: ['ingredientTypeSeafood', 'ingredientTypeSeafood.seafood'],
      where: {
        id: assignSeafoodIngredientTypeDto.ingredientTypeId,
        deletedAt: IsNull(),
      },
    });
  }
}
