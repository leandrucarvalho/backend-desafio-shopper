import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class MeasureService {
  constructor(private prisma: PrismaService) {}

  async insert(
    image: string,
    customerCode: string,
    measureDatetime: Date,
    measureType: string,
  ): Promise<any> {
    const existingMeasure = await this.prisma.measure.findFirst({
      where: {
        customer_code: customerCode,
        measure_type: measureType,
        measure_datetime: {
          gte: new Date(
            measureDatetime.getFullYear(),
            measureDatetime.getMonth(),
            1,
          ),
          lt: new Date(
            measureDatetime.getFullYear(),
            measureDatetime.getMonth() + 1,
            1,
          ),
        },
      },
    });

    if (existingMeasure) {
      throw new Error('Leitura do mês já realizada');
    }

    // const measureValue = await this.getMeasureFromImage(image);

    const newMeasure = await this.prisma.measure.create({
      data: {
        customer_code: customerCode,
        measure_type: measureType,
        measure_datetime: measureDatetime,
        // image: '',
        // measure_value: measureValue,
      },
    });

    return {
      image_url: newMeasure.image,
      measure_value: newMeasure.measure_value,
      measure_uuid: newMeasure.id,
    };
  }

  private async getMeasureFromImage(): Promise<number> {
    return 1234;
  }

  async confirm(): Promise<string> {
    return 'Confirmed Measure!';
  }

  async listByCustomCode(
    measureType: string,
    customerCode: string,
  ): Promise<any> {
    const allMeasures = await this.prisma.measure.findMany({
      where: {
        customer_code: customerCode,
        measure_type: measureType,
      },
    });
    return allMeasures;
  }
}
