# Frontend GhostPay

Interface de usuário para a plataforma GhostPay, desenvolvida com Next.js, React e Tailwind CSS.

## Funcionalidades

- Checkout para processamento de pagamentos
- Suporte para pagamentos via PIX e cartão de crédito
- Visualização de QR Code para pagamentos PIX
- Acompanhamento do status da transação
- Tela de confirmação de pagamento aprovado
- Interface responsiva e amigável

## Estrutura do Projeto

```
src/
├── actions/               # Funções de servidor para comunicação com a API
│   ├── checkout/          # Ações para processamento de checkout
│   └── payment/           # Ações para gerenciamento de pagamentos
│
├── app/                   # Páginas e layouts da aplicação
│   ├── checkout/          # Fluxo de checkout
│   │   ├── approved/      # Página de pagamento aprovado
│   │   └── payment/       # Página de processamento de pagamento
│   └── layout.tsx         # Layout principal da aplicação
│
├── components/            # Componentes reutilizáveis
│   ├── atoms/             # Componentes básicos (inputs, ícones, etc.)
│   ├── molecule/          # Composição de componentes (formulários, cartões, etc.)
│   └── ui/                # Componentes da interface de usuário
│
├── lib/                   # Utilitários e configurações
│   ├── query-provider.tsx # Provedor para gerenciamento de queries
│   └── utils.ts           # Funções auxiliares
│
├── models/                # Modelos de dados
│   └── ...
│
└── types/                 # Definições de tipos TypeScript
    └── ...
```

## Componentes Principais

- **CheckoutForm**: Formulário para coleta de dados do cliente e processamento de pagamento.
- **PaymentOption**: Seleção do método de pagamento (PIX ou cartão de crédito).
- **CollapsibleInstructions**: Instruções para o usuário sobre como proceder com o pagamento.
- **InformationCard**: Exibe dados relevantes sobre a transação.
- **SecurityDisclaimer**: Informação sobre a segurança do processo de pagamento.

## Tecnologias Utilizadas

- **Next.js 14**: Framework React com suporte a Server Components e App Router.
- **React**: Biblioteca para construção de interfaces.
- **Tailwind CSS**: Framework CSS para estilização.
- **Shadcn/UI**: Componentes de UI reutilizáveis.
- **TypeScript**: Linguagem de programação com tipagem estática.
- **React Hook Form**: Gerenciamento de formulários.
- **Docker**: Containerização da aplicação.

## Configuração e Instalação

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_API_URL=http://localhost:3333
```

### Instalar Dependências

```bash
npm install
# ou
yarn install
```

### Executando a Aplicação

```bash
# Desenvolvimento
npm run dev
# ou
yarn dev

# Produção
npm run build
npm run start
# ou
yarn build
yarn start
```

## Integração com o Backend

O frontend se comunica com a API GhostPay através dos endpoints:

- `/checkout`: Para criar novas transações de pagamento
- `/payment/{id_transacao}`: Para consultar o status de um pagamento
- `/payment/approve`: Para simular a aprovação de um pagamento (ambiente de teste)

### Fluxo de Integração

1. Na página de checkout, o usuário preenche os dados e seleciona o método de pagamento
2. Os dados são enviados para a API via endpoint `/checkout`
3. O resultado retornado pela API é apresentado ao usuário (QR Code para PIX ou formulário para cartão)
4. A aplicação consulta periodicamente o status do pagamento via `/payment/{id_transacao}`
5. Quando o pagamento é aprovado, o usuário é redirecionado para a tela de conclusão

## Implantação com Docker

```bash
# Construir e executar com Docker Compose
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:3000`.

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'feat: Adicionar nova funcionalidade'`)
4. Envie para o branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request
