import {
  IsEnum,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { MeasureTypes } from './measure-request.dto';

export class MeasureListQueryParams {
  @IsString({ message: 'Deve ser uma string' })
  @IsOptional({ message: 'Campo não obrigatório' })
  @IsEnum(MeasureTypes, {
    message: (args: ValidationArguments) => {
      const { constraints, value } = args;
      const correctValues = Object.keys(constraints[0]);
      return `O tipo '${value}' não permitido. O valor deve ser em caixa alta. Valores Disponíveis: ${correctValues.join(
        ',',
      )}`;
    },
    each: true,
  })
  measureType: string;

  constructor(measureType: any) {
    this.measureType = measureType;
  }
}
