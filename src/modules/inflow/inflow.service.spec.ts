import { Test, TestingModule } from '@nestjs/testing';
import { InflowService } from './inflow.service';

describe('InflowService', () => {
  let service: InflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InflowService],
    }).compile();

    service = module.get<InflowService>(InflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
