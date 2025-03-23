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

## Teste de API

Para facilitar o teste da API, um arquivo de endpoints está disponível para uso com a extensão REST Client.

### REST Client

REST Client é uma extensão popular para VS Code que permite enviar requisições HTTP diretamente do seu editor de código. Com ela, você pode testar endpoints facilmente sem precisar de ferramentas externas como Postman ou Insomnia.

### Instalação da Extensão

1. Abra o VS Code
2. Navegue até a seção de extensões (Ctrl+Shift+X ou Cmd+Shift+X no Mac)
3. Pesquise por "REST Client"
4. Instale a extensão desenvolvida por Huachao Mao

### Usando o Arquivo endpoints.http

O projeto inclui um arquivo `endpoints.http` na raiz do projeto que contém todas as requisições pré-configuradas para testar a API. Para usá-lo:

1. Abra o arquivo `endpoints.http` no VS Code
2. Você verá várias seções definindo diferentes requisições HTTP
3. Acima de cada definição de requisição, verá um link "Send Request"
4. Clique neste link para enviar a requisição correspondente

### Endpoints Disponíveis para Teste

O arquivo inclui os seguintes testes de endpoints:

1. **Criar Pagamento PIX**: Cria uma nova transação de pagamento via PIX
2. **Criar Pagamento com Cartão de Crédito**: Cria uma transação com pagamento parcelado
3. **Consultar Status do Pagamento**: Verifica o status atual de uma transação
4. **Aprovar Pagamento**: Simula a aprovação de um pagamento
5. **Acessar Documentação Swagger**: Acessa a documentação interativa da API

### Exemplo de Uso

```http
### 1. Criar Pagamento (Checkout) - PIX
# @name createPaymentPix
POST {{baseUrl}}/checkout
Content-Type: {{contentType}}

{
  "nome": "João Silva",
  "email": "joao.silva@example.com",
  "telefone": "11998765432",
  "cpf": "52998224725",
  "valor": 50000,
  "metodo_pagamento": "pix"
}
```

Depois de executar esta requisição, você receberá uma resposta contendo um `id_transacao` que pode ser usado nos endpoints subsequentes para consultar ou aprovar o pagamento.

### Fluxo de Teste Completo

Para testar o fluxo completo de pagamento:

1. Crie um pagamento usando o endpoint `/checkout`
2. Copie o `id_transacao` da resposta
3. Use este ID para consultar o status via `/payment/{id_transacao}`
4. Aprove o pagamento via `/payment/approve`
5. Consulte novamente o status para verificar se foi atualizado para `APPROVED`

### Configuração de Ambiente

O arquivo utiliza variáveis de ambiente para configurar a URL base e o tipo de conteúdo:

```http
### Variables
@baseUrl = http://localhost:3333
@contentType = application/json
```

Você pode modificar estas variáveis conforme necessário para apontar para diferentes ambientes de teste.

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
