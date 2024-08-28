import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class MeasureService {
  constructor(private prisma: PrismaService) {}

  async insert(): Promise<string> {
    return 'Hello World!';
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
