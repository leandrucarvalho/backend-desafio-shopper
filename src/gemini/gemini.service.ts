import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeminiResponseDto } from './dto/gemini-response-dto';

@Injectable()
export class GeminiService {
  private readonly fileManager: GoogleAIFileManager;
  private readonly genIA: any;
  private readonly model: any;

  constructor(private readonly configService: ConfigService) {
    this.fileManager = new GoogleAIFileManager(
      this.configService.get<string>('GEMINI_API_KEY'),
    );

    this.genIA = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY'),
    );

    this.model = this.genIA.getGenerativeModel({
      model: this.configService.get<string>('GEMINI_PRO_MODEL'),
    });
  }

  async analyzeImage({ data, mime }): Promise<GeminiResponseDto> {
    // Upload the file and specify a display name.
    const imageBuffer = Buffer.from(data, 'base64');
    const tempFilePath = './tmp/tempfile.jpg';
    fs.writeFileSync(tempFilePath, imageBuffer);

    // Faz o upload do Buffer convertido
    const uploadResponse = await this.fileManager.uploadFile(tempFilePath, {
      mimeType: mime,
      displayName: 'Uploaded Image',
    });

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
    );

    console.log('### ->>');

    // // Get the previously uploaded file's metadata.
    const getResponse = await this.fileManager.getFile(
      uploadResponse.file.name,
    );

    console.log(`Retrieved file ${JSON.stringify(getResponse)}`);
    console.log('### ->>');

    const prompt =
      'Analise a imagem fornecida e retorne exatamente neste formato JSON: {"ref_mes": "Referência do Mês", "consumo_faturado": "Consumo faturado ou consumo/kWh do mês de referência", "customer_code": "Código do cliente"}. Não inclua caracteres extras, quebras de linha, ou espaços desnecessários.';

    const fileData = [
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      {
        text: prompt,
      },
    ];

    const result = await this.model.generateContent(fileData);
    console.log(
      '### Reuslt',
      result.response.candidates[0].content.parts[0].text,
    );

    try {
      return new GeminiResponseDto(
        JSON.parse(result.response.candidates[0].content.parts[0].text),
        uploadResponse.file.uri,
      );
    } catch (error) {
      console.log('### ERROR', error);
    }
  }
}
