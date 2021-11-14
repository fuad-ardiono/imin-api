import { Test, TestingModule } from '@nestjs/testing';
import { InflowController } from './inflow.controller';
import { InflowService } from './inflow.service';

describe('InflowController', () => {
  let controller: InflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InflowController],
      providers: [InflowService],
    }).compile();

    controller = module.get<InflowController>(InflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
