import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { IsBase64 } from 'src/config/decorators/is-base64.decorator';

export enum MeasureTypes {
  'WATER' = 'WATER',
  'GAS' = 'GAS',
}

export class MeasureImageRequestDto {
  @IsString({
    message: 'Deve ser uma string',
  })
  @IsNotEmpty({
    message: 'Não pode ser nullo ou vazio',
  })
  @IsBase64({ message: 'A imagem deve ser uma string Base64 válida.' })
  data: string;

  @IsString({
    message: 'Deve ser uma string',
  })
  @IsNotEmpty({
    message: 'Não pode ser nullo ou vazio',
  })
  mime: string;

  constructor(imageRequestDto?: any) {
    this.data = imageRequestDto?.data;
    this.mime = imageRequestDto?.mime;
  }
}

export class MeasureRequestDto {
  image: MeasureImageRequestDto;

  @IsString({
    message: 'Deve ser uma string',
  })
  @IsNotEmpty({
    message: 'Não pode ser nullo ou vazio',
  })
  customer_code: string;

  @IsString({
    message: 'Deve ser uma string',
  })
  @IsNotEmpty({
    message: 'Não pode ser nullo ou vazio',
  })
  measure_datetime: string;

  @ApiProperty({
    example: 'WATER',
    description: 'Tipos de medição esperado',
    enum: MeasureTypes,
  })
  @IsNotEmpty()
  @IsString({ message: 'The field should be a string' })
  @IsEnum(MeasureTypes, {
    message: (args: ValidationArguments) => {
      const { constraints, value } = args;
      const correctValues = Object.keys(constraints[0]);
      return `The ${value} parameter is incorrect. Values should be in uppercase. Available values: ${correctValues.join(
        ',',
      )}`;
    },
    each: true,
  })
  measure_type: string;

  constructor(body?: any) {
    this.customer_code = body?.customer_code;
    this.measure_datetime = body?.measure_datetime;
    this.measure_type = body?.measure_type;

    const imageDto = new MeasureImageRequestDto(body?.image);
    this.image = imageDto;
  }
}
