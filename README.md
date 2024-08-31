# Water and Gas Meter Backend

Este projeto é um backend para gerenciar a leitura individualizada de consumo de água e gás. Utiliza IA para obter a medição através da foto de um medidor.

## Tecnologias Utilizadas

- **Node.js**
- **NestJS**
- **TypeScript**
- **Prisma**
- **Docker**
- **Google Generative AI (Gemini)**

## Requisitos

- Node.js
- Docker
- Prisma

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/water-gas-meter-backend.git
   cd water-gas-meter-backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   GEMINI_API_KEY="sua-chave-api-gemini"
   ```

4. Configure o Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

5. Inicie a aplicação com Docker:

   ```bash
   docker-compose up --build
   ```

## Endpoints

### POST /upload

Recebe uma imagem em base64, consulta o Gemini e retorna a medida lida pela API.

**Request Body:**

```json
{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "datetime",
  "measure_type": "WATER" ou "GAS"
}
```

**Response Body:**

```json
{
  "image_url": "string",
  "measure_value": "integer",
  "measure_uuid": "string"
}
```

### PATCH /confirm

Confirma ou corrige o valor lido pelo LLM.

**Request Body:**

```json
{
  "measure_uuid": "string",
  "confirmed_value": "integer"
}
```

**Response Body:**

```json
{
  "success": true
}
```

### GET /<customer_code>/list

Lista as medidas realizadas por um determinado cliente.

**Query Parameters:**

- `measure_type` (opcional): "WATER" ou "GAS"

**Response Body:**

```json
{
  "customer_code": "string",
  "measures": [
    {
      "measure_uuid": "string",
      "measure_datetime": "datetime",
      "measure_type": "string",
      "has_confirmed": "boolean",
      "image_url": "string"
    }
  ]
}
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça o push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT.
