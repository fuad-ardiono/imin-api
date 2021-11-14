import { Module } from '@nestjs/common';
import { InflowService } from './inflow.service';
import { InflowController } from './inflow.controller';

@Module({
  controllers: [InflowController],
  providers: [InflowService]
})
export class InflowModule {}
