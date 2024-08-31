import { Module } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { GeminiModule } from 'src/gemini/gemini.module';
import { MeasureController } from './measure.controller';
import { MeasureService } from './measure.service';

@Module({
  imports: [GeminiModule],
  controllers: [MeasureController],
  providers: [MeasureService, PrismaService],
})
export class MeasureModule {}
