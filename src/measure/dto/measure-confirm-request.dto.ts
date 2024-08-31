import { IsNotEmpty, IsString } from 'class-validator';

export class MeasureConfirmRequestDto {
  @IsString({ message: 'Deve ser um valor string' })
  @IsNotEmpty({ message: 'Não deve ser nulo ou vazio' })
  measureUuid: string;
  @IsString({ message: 'Deve ser um valor string' })
  @IsNotEmpty({ message: 'Não deve ser nulo ou vazio' })
  confirmedValue: string;

  constructor(body?: any) {
    this.confirmedValue = body?.confirmedValue;
    this.measureUuid = body?.measureUuid;
  }
}
