import { z } from "zod";

export interface Customer {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export const customerSchema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  email: z.string({ required_error: "Email é obrigatório" }).email(),
  phone: z.string({ required_error: "Telefone é obrigatório" }),
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
});
