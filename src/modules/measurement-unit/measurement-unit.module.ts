import { Module } from '@nestjs/common';
import { MeasurementUnitService } from './measurement-unit.service';
import { MeasurementUnitController } from './measurement-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeasurementUnit } from './entities/measurement-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnit])],
  controllers: [MeasurementUnitController],
  providers: [MeasurementUnitService],
})
export class MeasurementUnitModule {}
