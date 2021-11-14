import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards
} from "@nestjs/common";
import { MeasurementUnitService } from './measurement-unit.service';
import { CreateMeasurementUnitDto } from './dto/create-measurement-unit.dto';
import { UpdateMeasurementUnitDto } from './dto/update-measurement-unit.dto';
import { UserGuard } from '../../guards/user/user.guard';

@Controller('measurement-unit')
@UseGuards(UserGuard)
export class MeasurementUnitController {
  constructor(
    private readonly measurementUnitService: MeasurementUnitService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMeasurementUnitDto: CreateMeasurementUnitDto) {
    return this.measurementUnitService.create(createMeasurementUnitDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateMeasurementUnitDto: UpdateMeasurementUnitDto,
  ) {
    return this.measurementUnitService.update(id, updateMeasurementUnitDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async index() {
    return this.measurementUnitService.index();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async detail(@Param('id') id: number) {
    return this.measurementUnitService.findOneById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.measurementUnitService.delete(id);
  }
}
