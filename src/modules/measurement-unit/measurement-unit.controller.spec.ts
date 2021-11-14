import { Test, TestingModule } from '@nestjs/testing';
import { MeasurementUnitController } from './measurement-unit.controller';
import { MeasurementUnitService } from './measurement-unit.service';

describe('MeasurementUnitController', () => {
  let controller: MeasurementUnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeasurementUnitController],
      providers: [MeasurementUnitService],
    }).compile();

    controller = module.get<MeasurementUnitController>(MeasurementUnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
