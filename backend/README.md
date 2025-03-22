<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# API GhostPay

Uma API de processamento de pagamentos desenvolvida com NestJS, com suporte para pagamentos PIX e cartão de crédito.

## Funcionalidades

- Criação de transações de pagamento
- Processamento de pagamentos PIX com geração de QR Code (integração com API Pronttus)
- Simulação de aprovação de pagamento
- Visualização de status e detalhes da transação
- Implementação do padrão Strategy para diferentes métodos de pagamento

## Estrutura do Projeto

```
src/
├── core/                  # Serviços de infraestrutura
│   ├── db/                # Serviços de banco de dados (Prisma)
│   └── core.module.ts
│
├── modules/               # Módulos de funcionalidades
│   ├── payments/          # Processamento de pagamentos
│   │   ├── dto/           # Objetos de Transferência de Dados
│   │   ├── gateways/      # Gateways de integração com APIs externas
│   │   ├── repositories/  # Repositórios para acesso a dados
│   │   ├── strategies/    # Implementações de estratégias de pagamento
│   │   ├── errors/        # Exceções específicas do domínio
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   └── payments.module.ts
│   └── modules.module.ts
│
└── app.module.ts          # Módulo principal da aplicação
```

## Componentes Principais

- **Controllers**: Manipulam requisições HTTP e delegam a lógica para os serviços.
- **Services**: Orquestram a lógica de negócio e aplicam regras.
- **Repositories**: Abstraem interações com o banco de dados.
- **Gateways**: Responsáveis pela comunicação com APIs externas.
- **Strategies**: Implementam diferentes estratégias de processamento de pagamento.
- **DTOs**: Garantem comunicação consistente entre as camadas.

## Endpoints da API

### Criar Transação de Pagamento

```
POST /checkout

Corpo da Requisição:
{
  "nome": "João Almeida",
  "email": "joaoalmeida22@gmail.com",
  "telefone": "19995424903",
  "cpf": "42446021243",
  "valor": 3050000,  // Valor em centavos
  "metodo_pagamento": "pix",  // "pix" ou "credit_card"
  "parcelas": 1  // Opcional, para pagamentos com cartão
}

Resposta:
{
  "id_transacao": "uuid",
  "valor": 30500.00,
  "pix_qr_code": "data:image/png;base64,...",
  "pix_code": "00020126850014br.gov.bcb.pix2563...",
  "status": "PENDING",
  "prazo_pagamento": "2024-03-20T08:17:00Z"
}
```

### Aprovar Pagamento

```
POST /payment/approve

Corpo da Requisição:
{
  "id_transacao": "uuid"
}

Resposta:
{
  "message": "Pagamento aprovado com sucesso"
}
```

### Consultar Status do Pagamento

```
GET /payment/:order_id

Resposta:
{
  "status": "APPROVED",
  "nome": "João Almeida",
  "email": "joaoalmeida22@gmail.com",
  "telefone": "19995424903",
  "cpf": "42446021243",
  "valor_total": 3050000,
  "valor_pago": 3050000,
  "metodo_pagamento": "pix",
  "parcelas": 1,
  "id_transacao": "uuid"
}
```

## Configuração e Instalação

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL

### Variáveis de Ambiente

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ghost_pay"
PORT=3000
PRONTTUS_API_URL="https://api.pronttus.com.br/v1"
PRONTTUS_CLIENT_ID="seu-client-id"
PRONTTUS_CLIENT_SECRET="seu-client-secret"
```

### Instalar Dependências

```bash
npm install
```

### Configuração do Banco de Dados

```bash
npx prisma migrate dev
```

### Executando a Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### Executar Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e
```

## Implantação com Docker

```bash
# Construir e executar com Docker Compose
docker-compose up -d
```

## Padrões de Design

### Padrão Strategy

A aplicação utiliza o padrão Strategy para lidar com diferentes métodos de pagamento. Isso permite:

- Separação clara da lógica de processamento de pagamento
- Fácil adição de novos métodos de pagamento
- Responsabilidade única para cada estratégia de pagamento
- Flexibilidade para alternar entre estratégias em tempo de execução

A implementação consiste em:

- Interface `PaymentStrategy`
- Implementações concretas para pagamentos PIX e cartão de crédito
- `PaymentStrategyFactory` para criar a estratégia apropriada

### Padrão Repository

O padrão Repository é utilizado para abstrair o acesso a dados:

- Centraliza a lógica de acesso ao banco de dados
- Facilita a manutenção e testes
- Permite substituir a implementação de persistência sem afetar a lógica de negócio

### Padrão Gateway

Para integrações com APIs externas, usamos o padrão Gateway:

- Isola a comunicação com sistemas externos
- Facilita a simulação (mock) para testes
- Simplifica a troca de provedores de serviço

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
