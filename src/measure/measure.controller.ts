import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MeasureService } from './measure.service';

@Controller('measure')
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Get(':customer_code/list')
  async listMeasure(
    @Query('measure_type') measureType: string,
    @Param('customer_code') customerCode: string,
  ): Promise<any> {
    return await this.measureService.listByCustomCode(
      measureType,
      customerCode,
    );
  }

  @Post('upload')
  @HttpCode(200)
  async insertMeasure(
    @Body('image') image: string,
    @Body('customer_code') customerCode: string,
    @Body('measure_datetime') measureDatetime: Date,
    @Body('measure_type') measureType: string,
  ): Promise<any> {
    return await this.measureService.insert(
      image,
      customerCode,
      measureDatetime,
      measureType,
    );
  }

  @Patch('confirm')
  async confirmMeasure(
    @Body('measure_uuid') measureUuid: string,
    @Body('confirmd_value') confirmedValue: number,
  ): Promise<string> {
    return await this.measureService.confirmMeasure(
      measureUuid,
      confirmedValue,
    );
  }
}
