import { z } from "zod";

export interface CheckoutRequest {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  valor: number;
  metodo_pagamento: PaymentType;
}

export enum PaymentType {
  PIX = "pix",
  CREDIT_CARD = "credit_card",
}

export const checkoutRequestSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  cpf: z.string({ required_error: "CPF é obrigatório" }).refine((cpf) => {
    if (!cpf) return false;
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = soma % 11;
    if (resto < 2) {
      resto = 0;
    } else {
      resto = 11 - resto;
    }
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf[i]) * (11 - i);
    }
    let resto2 = soma % 11;
    if (resto2 < 2) {
      resto2 = 0;
    } else {
      resto2 = 11 - resto2;
    }
    if (resto2 !== parseInt(cpf[10])) return false;
    return true;
  }),
  valor: z.number().min(1),
  metodo_pagamento: z.nativeEnum(PaymentType),
});
