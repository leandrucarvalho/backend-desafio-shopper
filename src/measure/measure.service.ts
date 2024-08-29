import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { isUUID } from 'class-validator';

@Injectable()
export class MeasureService {
  constructor(private prisma: PrismaService) {}

  async insert(
    image: string,
    customerCode: string,
    measureDatetime: Date,
    measureType: string,
  ): Promise<any> {
    const date = new Date(measureDatetime);

    if (isNaN(date.getTime())) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'A data fornecida não é válida.',
      });
    }

    if (!this.isValidBase64(image)) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'A imagem não está em formato Base64 válido.',
      });
    }

    const existingMeasure = await this.prisma.measure.findFirst({
      where: {
        customer_code: customerCode,
        measure_type: measureType,
        measure_datetime: {
          gte: new Date(date.getFullYear(), date.getMonth(), 1),
          lt: new Date(date.getFullYear(), date.getMonth() + 1, 1),
        },
      },
    });

    if (existingMeasure) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    // 3. Integrar com a API LLM (Google Gemini)
    const measureValue = await this.getMeasureFromImage(/* image */);

    // 4. Persistir a leitura no banco de dados
    const newMeasure = await this.prisma.measure.create({
      data: {
        customer_code: customerCode,
        measure_type: measureType,
        measure_datetime: date,
        measure_value: measureValue,
        // image: 'url-da-imagem', // Substitua pela URL real da imagem gerada pelo serviço de armazenamento
      },
    });

    // 5. Retornar a resposta com os dados
    return {
      image_url: newMeasure.image,
      measure_value: newMeasure.measure_value,
      measure_uuid: newMeasure.id, // Supondo que o ID seja o UUID
    };
  }

  private async getMeasureFromImage(/* image: string */): Promise<number> {
    // Chamar a API do Google Gemini e processar a resposta
    // Aqui está um exemplo simulado:
    return 1234; // Substitua com a lógica real para integrar com a LLM
  }

  private isValidBase64(str: string): boolean {
    // Validação simples de Base64
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return err;
    }
  }

  async confirmMeasure(
    measureUuid: string,
    confirmedValue: number,
  ): Promise<any> {
    if (!isUUID(measureUuid) || typeof confirmedValue !== 'number') {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'UUID ou valor confirmado inválido.',
      });
    }

    const existingMeasure = await this.prisma.measure.findUnique({
      where: { uuid: measureUuid },
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
      where: { uuid: measureUuid },
      data: {
        measure_value: confirmedValue,
        is_confirmed: true,
      },
    });

    return { success: true };
  }

  async listByCustomCode(
    measureType: string,
    customerCode: string,
  ): Promise<any> {
    if (measureType && !['WATER', 'GAS'].includes(measureType.toUpperCase())) {
      throw new BadRequestException({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }

    const filters: any = {
      customer_code: customerCode,
    };

    if (measureType) {
      filters.measure_type = measureType.toUpperCase();
    }

    const allMeasures = await this.prisma.measure.findMany({
      where: filters,
    });

    if (!allMeasures || allMeasures.length === 0) {
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
