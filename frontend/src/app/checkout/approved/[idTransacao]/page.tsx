import { GhostsPayLogo } from "@/components/atoms/logo";

import { getPaymentStatus } from "@/actions";
import {
  InformationCard,
  InformationCardRow,
} from "@/components/molecule/information-card";
import { formatCPF, formatCurrency, formatPhone } from "@/lib/utils";
import { Identifier } from "@/components/molecule/identifier";
import { notFound } from "next/navigation";
import { TransactionStatus } from "@/models/payment-status-response";

export default async function ApprovedPage({
  params,
}: {
  params: Promise<{ idTransacao: string }>;
}) {
  const idTransacao = (await params).idTransacao;
  const paymentData = await getPaymentStatus(idTransacao);
  if (!paymentData) {
    return notFound();
  }
  if (paymentData.status !== TransactionStatus.APPROVED) {
    return (
      <div className="px-4 pt-8">
        <div className="flex justify-center mb-6">
          <GhostsPayLogo />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold mb-2">
            Pagamento não aprovado.
            <br />
            Por favor, tente novamente.
          </h1>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 pt-8">
      <div className="flex justify-center mb-6">
        <GhostsPayLogo />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-xl font-semibold mb-2">
          Agradecemos a sua compra.
          <br />
          Pagamento aprovado com sucesso!
        </h1>
      </div>

      <div className="mb-6">
        <InformationCard label="Informações comprador">
          <InformationCardRow label="Nome comprador" value={paymentData.nome} />
          <InformationCardRow
            label="E-mail comprador"
            value={paymentData.email}
          />
          <InformationCardRow
            label="Telefone comprador"
            value={formatPhone(paymentData.telefone)}
          />
          <InformationCardRow
            label="CPF comprador"
            value={formatCPF(paymentData.cpf)}
          />
        </InformationCard>
      </div>

      <div className="mb-8">
        <InformationCard label="Informações pagamento">
          <InformationCardRow
            label="Método de Pagamento"
            value={
              paymentData.metodo_pagamento === "pix"
                ? "Pix"
                : "Cartão de Crédito"
            }
          />
          <InformationCardRow
            label="Parcelas"
            value={`${paymentData.parcelas}x`}
          />
          <InformationCardRow
            label="Sub total"
            value={formatCurrency(paymentData.valor_total)}
          />
          <InformationCardRow
            label="Total"
            value={formatCurrency(paymentData.valor_pago)}
            valueClassName="text-primary"
          />
        </InformationCard>
      </div>

      <Identifier idTransacao={idTransacao} />
    </div>
  );
}
