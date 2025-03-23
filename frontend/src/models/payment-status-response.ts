export interface PaymentStatusResponse {
  status: TransactionStatus;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  valor_total: number;
  valor_pago: number;
  metodo_pagamento: string;
  parcelas: number;
  id_transacao: string;
}

export enum TransactionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}
