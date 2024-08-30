import { Module } from '@nestjs/common';
import { MeasureModule } from './measure/measure.module';
import { ConfigModule } from '@nestjs/config';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [ConfigModule.forRoot(), MeasureModule, GeminiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
