import { PaymentType } from "@/models/checkout-request";
import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z
    .string()
    .min(10, { message: "Telefone deve ter pelo menos 10 dígitos" })
    .regex(/^\(?([0-9]{2})\)?\s?([0-9]{4,5})-?([0-9]{4})$/, {
      message: "Telefone inválido. Formato: (xx) xxxxx-xxxx",
    }),
  cpf: z
    .string()
    .min(11, { message: "CPF deve ter 11 dígitos" })
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, {
      message: "CPF inválido. Formato: xxx.xxx.xxx-xx",
    }),
  paymentType: z.nativeEnum(PaymentType, {
    required_error: "Selecione um método de pagamento",
  }),
  installments: z.number().int().min(0).max(12).optional().default(0),
});

export type PaymentFormValues = z.infer<typeof checkoutFormSchema>;
