import {
  Body,
  Controller,
  Get,
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
  ): Promise<string> {
    return await this.measureService.listByCustomCode(
      measureType,
      customerCode,
    );
  }

  @Post('upload')
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
  async confirmMeasure(): Promise<string> {
    return await this.measureService.confirm();
  }
}
