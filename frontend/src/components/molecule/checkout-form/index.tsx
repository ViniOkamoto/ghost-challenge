"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentType } from "@/models/checkout-request";
import { checkoutFormSchema, PaymentFormValues } from "../../../types/schema";
import { useMutation } from "@tanstack/react-query";
import { createCheckout } from "@/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { FormInput } from "@/components/atoms/form-input";
import { PaymentOption } from "@/components/molecule/payment-option";
import { CreditCardOptions } from "@/components/molecule/credit-card-options";
import { CheckoutRequestData } from "@/types/checkout-request.type";

const PRODUCT_VALUE = 30500.0;
const PIX_DISCOUNT_AMOUNT = 300.0;

export default function CheckoutForm() {
  const router = useRouter();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      paymentType: PaymentType.PIX,
      installments: 1,
    },
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CheckoutRequestData) => createCheckout(data),
    onSuccess: (data) => {
      toast.success("Pedido criado com sucesso!");
      sessionStorage.setItem("current_checkout_data", JSON.stringify(data));
      sessionStorage.setItem("current_order_id", data.id_transacao);
      router.push(`/checkout/payment/${data.id_transacao}`);
    },
    onError: (error) => {
      console.log("Checkout error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao processar o pedido. Tente novamente.";

      toast.error(errorMessage);
    },
  });

  const selectedPaymentType = form.watch("paymentType");

  const calculateFinalValue = () => {
    if (selectedPaymentType === PaymentType.PIX) {
      return PRODUCT_VALUE - PIX_DISCOUNT_AMOUNT;
    }
    return PRODUCT_VALUE;
  };

  const onSubmit = (data: PaymentFormValues) => {
    const finalValue = calculateFinalValue();

    const valueInCents = Math.round(finalValue * 100);

    const apiData: CheckoutRequestData = {
      nome: data.name,
      email: data.email,
      telefone: data.phone.replace(/\D/g, ""),
      cpf: data.cpf.replace(/\D/g, ""),
      valor: valueInCents,
      metodo_pagamento: data.paymentType,
      parcelas: data.installments || 1,
    };

    mutate(apiData);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-4 flex flex-col gap-8"
        >
          <FormInput<PaymentFormValues>
            label="Digite seu nome"
            name="name"
            form={form}
            placeholder="Seu nome completo"
          />

          <FormInput<PaymentFormValues>
            label="Digite seu e-mail"
            name="email"
            form={form}
            placeholder="email@exemplo.com.br"
            type="email"
          />

          <FormInput<PaymentFormValues>
            label="Digite seu telefone"
            name="phone"
            form={form}
            placeholder="(00) 00000-0000"
            mask="(99) 99999-9999"
          />

          <FormInput<PaymentFormValues>
            label="Digite seu CPF"
            name="cpf"
            form={form}
            placeholder="000.000.000-00"
            mask="999.999.999-99"
          />

          <div>
            <h2 className="text-gray-700 font-bold text-xl mb-10 text-center">
              João, como você quer pagar?
            </h2>

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value as PaymentType);
                        if (value === PaymentType.PIX) {
                          form.setValue("installments", 1);
                        }
                      }}
                      value={field.value}
                      className="flex flex-col space-y-4"
                    >
                      {/* Pix Option */}
                      <PaymentOption
                        label="Pix"
                        value={PaymentType.PIX}
                        isSelected={field.value === PaymentType.PIX}
                        onClick={() => field.onChange(PaymentType.PIX)}
                      >
                        <div>
                          <div className="flex text-2xl gap-2 text-gray-800">
                            <p className="font-bold">1x</p>
                            <p className="font-medium">R$ 30.500,00</p>
                          </div>
                          <p className="text-base font-medium text-primary">
                            Ganhe 5% de desconto
                          </p>
                        </div>
                        <div className="bg-primary-900 text-white p-2 pl-3 mt-2 text-sm flex items-center ribbon-container w-full">
                          <span className="mr-2">🤑</span>
                          R$ 300,00 de desconto no seu Pix
                        </div>
                      </PaymentOption>

                      <div className="mt-4">
                        <CreditCardOptions
                          form={form}
                          isSelected={field.value === PaymentType.CREDIT_CARD}
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary-900 hover:bg-primary-900 mt-4"
            disabled={isPending}
          >
            {isPending ? "Processando..." : "Finalizar Compra"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
