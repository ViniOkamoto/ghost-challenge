export interface CheckoutRequestData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  valor: number;
  metodo_pagamento: string; // 'pix' or 'credit_card'
  parcelas?: number;
}
