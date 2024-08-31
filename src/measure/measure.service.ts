import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { PrismaService } from 'src/config/prisma/prisma.service';

import { GeminiService } from 'src/gemini/gemini.service';
import { MeasureRequestDto } from './dto/measure-request.dto';
import { MeasureConfirmRequestDto } from './dto/measure-confirm-request.dto';
import { MeasureListQueryParams } from './dto/measure-list-query-params.dto';
import { MeasureListPathParams } from './dto/measure-list-path-params.dto';
import { isEmpty } from 'lodash';
import { GeminiResponseDto } from 'src/gemini/dto/gemini-response-dto';

@Injectable()
export class MeasureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly _geminiService: GeminiService,
  ) {}

  async insert(body: MeasureRequestDto): Promise<any> {
    const _validatedBody = new MeasureRequestDto(body);
    await validateOrReject(_validatedBody);

    // fazer o analizes pra pegar o ref_mes.
    const resultAnalyzes: GeminiResponseDto =
      await this._geminiService.analyzeImage({
        data: body.image.data,
        mime: body.image.mime,
      });

    console.log('### ResultImageAnalyze', resultAnalyzes);

    const existingMeasure = await this.prisma.measure.findFirst({
      where: {
        customer_code: resultAnalyzes.customer_code,
        measure_type: body.measure_type,
        measure_datetime: resultAnalyzes.ref_mes,
      },
    });

    if (existingMeasure) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    const newMeasure = await this.prisma.measure.create({
      data: {
        customer_code: resultAnalyzes.customer_code,
        measure_type: body.measure_type,
        measure_datetime: resultAnalyzes.ref_mes,
        measure_value: resultAnalyzes.consumo_faturado,
        image: resultAnalyzes.imageUri,
      },
    });

    return {
      image_url: newMeasure.image,
      measure_value: newMeasure.measure_value,
      measure_uuid: newMeasure.uuid,
    };
  }

  async confirmMeasure(bodyRequest: MeasureConfirmRequestDto): Promise<any> {
    const _validatedBody = new MeasureConfirmRequestDto(bodyRequest);
    await validateOrReject(_validatedBody);

    const existingMeasure = await this.prisma.measure.findUnique({
      where: { uuid: _validatedBody.measureUuid },
    });

    if (!existingMeasure) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada.',
      });
    }

    if (existingMeasure.is_confirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura já confirmada.',
      });
    }

    await this.prisma.measure.update({
      where: { uuid: _validatedBody.measureUuid },
      data: {
        measure_value: _validatedBody.confirmedValue,
        is_confirmed: true,
      },
    });

    return { success: true };
  }

  async listByCustomCode(
    measureType: string,
    customerCode: string,
  ): Promise<any> {
    const _validateQueryParams = new MeasureListQueryParams(measureType);
    try {
      await validateOrReject(_validateQueryParams);
    } catch (_error: any) {
      throw new BadRequestException({
        error_code: 'INVALID_TYPE',
        error_description: _error[0].constraints.isEnum,
      });
    }

    const _validatePathParams = new MeasureListPathParams(customerCode);
    await validateOrReject(_validatePathParams);

    const filters: any = {
      customer_code: customerCode,
    };

    if (measureType) {
      filters.measure_type = measureType.toUpperCase();
    }

    const allMeasures = await this.prisma.measure.findMany({
      where: filters,
    });

    if (isEmpty(allMeasures)) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    return {
      customer_code: customerCode,
      measures: allMeasures.map((measure) => ({
        measure_uuid: measure.uuid,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: !!measure.is_confirmed,
        image_url: measure.image,
      })),
    };
  }
}
