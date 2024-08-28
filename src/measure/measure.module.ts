import { Module } from '@nestjs/common';
import { MeasureController } from './measure.controller';
import { MeasureService } from './measure.service';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [MeasureController],
  providers: [MeasureService, PrismaService],
})
export class MeasureModule {}
