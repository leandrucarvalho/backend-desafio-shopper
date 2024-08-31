import { IsNotEmpty, IsString } from 'class-validator';

export class MeasureListPathParams {
  @IsString({ message: 'Deve ser uma string' })
  @IsNotEmpty({ message: 'Não deve ser nulo ou vazio' })
  customerCode: string;

  constructor(customerCode: any) {
    this.customerCode = customerCode;
  }
}
