import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
      model: 'gemini-1.5-pro',
    });
  }

  async analyzeImage(body: any): Promise<any> {
    // Upload the file and specify a display name.
    // const uploadResponse = await this.fileManager.uploadFile('jetpack.jpg', {
    //   mimeType: 'image/jpeg',
    //   displayName: 'Jetpack drawing',
    // });

    // console.log(
    //   `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
    // );

    // // Get the previously uploaded file's metadata.
    // const getResponse = await this.fileManager.getFile(
    //   uploadResponse.file.name,
    // );

    // console.log(`Retrieved file ${JSON.stringify(getResponse)}`);

    const prompt =
      'De acordo com a imagem informada, retorne no formato JSON os seguintes dados: Referência do Mês, consumo faturado ou consumo/kWh do mês de referência e o código do cliente';

    // const part1 = this.fileToGenerativePart({
    //   data: base64Str.image.data,
    //   mimeType: base64Str.image.mime,
    // });
    const part1 = this.fileToGenerativePart({
      data: body.image.data,
      mimeType: body.image.mime,
    });

    let result;
    try {
      result = await this.model.generateContent([prompt, part1]);
      return result;
    } catch (error) {
      console.log('### ERROR', error);
    }

    // console.log('### REsult', result.response.text());
  }

  fileToGenerativePart({ data, mimeType }) {
    return {
      inlineData: {
        data,
        mimeType,
      },
    };
  }
}
