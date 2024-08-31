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
import { ApiTags } from '@nestjs/swagger';
import { MeasureRequestDto } from './dto/measure-request.dto';
import { MeasureConfirmRequestDto } from './dto/measure-confirm-request.dto';
@ApiTags('Measure')
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
  async insertMeasure(@Body() body: MeasureRequestDto): Promise<any> {
    return await this.measureService.insert(body);
  }

  @Patch('confirm')
  async confirmMeasure(
    @Body() bodyRequest: MeasureConfirmRequestDto,
  ): Promise<string> {
    return await this.measureService.confirmMeasure(bodyRequest);
  }
}
