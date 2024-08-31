export class GeminiResponseDto {
  ref_mes: string;
  consumo_faturado: string;
  customer_code: string;
  imageUri: string;

  constructor(result: any, uploadedUri: string) {
    this.ref_mes = result?.ref_mes;
    this.consumo_faturado = result?.consumo_faturado
      ? result?.consumo_faturado
      : '0';
    this.customer_code = result?.customer_code;
    this.imageUri = uploadedUri;
  }
}
