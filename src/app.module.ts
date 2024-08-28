import { Module } from '@nestjs/common';
import { MeasureModule } from './measure/measure.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), MeasureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
