export interface PaymentStatusResponse {
  status: string;
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
