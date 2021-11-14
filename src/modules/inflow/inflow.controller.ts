import { Controller } from '@nestjs/common';
import { InflowService } from './inflow.service';

@Controller('inflow')
export class InflowController {
  constructor(private readonly inflowService: InflowService) {}
}
