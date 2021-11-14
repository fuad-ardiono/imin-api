import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { MeasurementUnit } from './entities/measurement-unit.entity';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMeasurementUnitDto } from './dto/update-measurement-unit.dto';
import { NotFoundException } from '../../exceptions/notfound.exception';

@Injectable()
export class MeasurementUnitService {
  constructor(
    @InjectRepository(MeasurementUnit)
    private readonly measurementUnitRepository: Repository<MeasurementUnit>,
  ) {}

  findOneById(id: number): Promise<MeasurementUnit> {
    return this.measurementUnitRepository.findOne({ id, deletedAt: IsNull() });
  }

  findByDeletedAtNull(): Promise<MeasurementUnit[]> {
    return this.measurementUnitRepository.find({ deletedAt: IsNull() });
  }

  async create(
    createMeasurementUnit: CreateMeasurementUnitDto,
  ): Promise<MeasurementUnit> {
    const newMeasurementUnit = Object.assign(
      new MeasurementUnit(),
      createMeasurementUnit,
    );

    return this.measurementUnitRepository.save(newMeasurementUnit);
  }

  async update(
    id: number,
    updateMeasurementUnitDto: UpdateMeasurementUnitDto,
  ): Promise<MeasurementUnit> {
    const measurementUnitRecord = await this.findOneById(id);

    if (!measurementUnitRecord) {
      throw new NotFoundException('measurement unit not found');
    }

    const updatedMeasurementUnit = Object.assign(
      measurementUnitRecord,
      updateMeasurementUnitDto,
    );

    await this.measurementUnitRepository.update({ id }, updatedMeasurementUnit);

    return this.findOneById(id);
  }

  async delete(id: number): Promise<MeasurementUnit> {
    const measurementUnitRecord = await this.findOneById(id);

    if (!measurementUnitRecord) {
      throw new NotFoundException('measurement unit not found');
    }

    measurementUnitRecord.deletedAt = new Date();

    await this.measurementUnitRepository.update({ id }, measurementUnitRecord);

    return this.findOneById(id);
  }

  async index(): Promise<MeasurementUnit[]> {
    return this.findByDeletedAtNull();
  }

  async detail(id: number): Promise<MeasurementUnit> {
    return this.findOneById(id)
  }
}
