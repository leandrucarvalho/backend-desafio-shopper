import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('analyze')
  async analyzeImage(@Body() body: any) {
    const result = await this.geminiService.analyzeImage(body);
    return {
      success: true,
      data: result,
    };
  }
}
