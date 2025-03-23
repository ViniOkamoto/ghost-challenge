export interface CheckoutResponse {
  id_transacao: string;
  valor: number;
  pix_qr_code?: string;
  pix_code?: string;
  status: string;
  prazo_pagamento: string;
}
