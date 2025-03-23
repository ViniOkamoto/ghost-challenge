"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { GhostsPayLogo } from "@/components/atoms/logo";
import { CollapsibleInstructions } from "@/components/molecule/collapsible-instructions";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { approvePayment } from "@/actions/payment";
import { getPaymentStatus } from "@/actions";
import { PasteIcon } from "@/components/atoms/icons/paste";
import { Identifier } from "@/components/molecule/identifier";
import { formatCurrency } from "@/lib/utils";
import { CheckoutResponse } from "@/types/checkout-response.type";

export default function PaymentPage() {
  const params = useParams<{ idTransacao: string }>();
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutResponse | null>(
    null
  );

  const idTransacao = params.idTransacao;

  // Retrieve checkout data from sessionStorage (contains QR code)
  useEffect(() => {
    const storedData = sessionStorage.getItem("current_checkout_data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData) as CheckoutResponse;
        setCheckoutData(parsedData);
      } catch (e) {
        console.error("Error parsing checkout data:", e);
      }
    }
  }, []);

  // Poll for payment status
  const {
    data: paymentStatus,
    isLoading: isStatusLoading,
    error: statusError,
    refetch,
  } = useQuery({
    queryKey: ["payment-status", idTransacao],
    queryFn: () => getPaymentStatus(idTransacao),
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: !!idTransacao,
  });

  // Copy PIX code to clipboard
  const copyPixCode = () => {
    if (checkoutData?.pix_code) {
      navigator.clipboard.writeText(checkoutData.pix_code);
      setIsCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  // Simulate payment approval
  const handleApprovePayment = async () => {
    setIsApproving(true);
    try {
      await approvePayment(idTransacao);
      toast.success("Pagamento aprovado com sucesso!");
      router.push(`/checkout/approved/${idTransacao}`);
    } catch (error) {
      toast.error("Erro ao aprovar pagamento");
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  // Show loading state if we're still fetching checkout data or payment status
  if ((isStatusLoading && !checkoutData) || (!checkoutData && !paymentStatus)) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="flex justify-center mb-6">
          <GhostsPayLogo />
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 w-64 bg-gray-200 rounded mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (statusError && !checkoutData) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="flex justify-center mb-6">
          <GhostsPayLogo />
        </div>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">
            Erro ao carregar informações do pagamento. Por favor, tente
            novamente.
          </p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  // If payment is approved, redirect to confirmation page
  if (paymentStatus?.status === "APPROVED") {
    router.push(`/checkout/approved/${idTransacao}`);
    return null;
  }

  // Format expiration date
  const formatExpirationDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("pt-BR")} - ${date.toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )}`;
  };

  // Get the payment amount to display
  const paymentAmount = checkoutData?.valor
    ? formatCurrency(checkoutData.valor)
    : "R$ 30.500,00";

  // Define the steps for the collapsible instructions
  const instructionSteps = [
    {
      step: 1,
      description: "Abra o app do seu banco e entre no ambiente Pix;",
    },
    {
      step: 2,
      description:
        "Escolha Pagar com QR Code e aponte a câmera para o código acima, ou cole o código identificador da transação;",
    },
    {
      step: 3,
      description: "Confirme as informações e finalize sua compra.",
    },
  ];

  return (
    <div className="py-8 px-4">
      <div className="flex justify-center mb-6">
        <GhostsPayLogo />
      </div>

      <h1 className="font-bold text-2xl text-gray-800 text-center mb-5 ">
        João, faça o pagamento de <br /> {paymentAmount} pelo Pix
      </h1>

      {checkoutData?.pix_qr_code && (
        <Image
          src={checkoutData.pix_qr_code}
          alt="QR Code PIX"
          className="w-64 h-64 mx-auto border-2 border-primary-500 rounded-md mb-5"
          width={256}
          height={256}
        />
      )}

      <Button
        className="w-full mb-4 py-6 text-base"
        onClick={copyPixCode}
        disabled={!checkoutData?.pix_code}
      >
        {isCopied ? "Código PIX copiado!" : "Clique para copiar código PIX"}
        <PasteIcon />
      </Button>

      <div className="text-center mb-4 flex flex-col ">
        <p className="text-gray-600 text-base">Prazo de pagamento:</p>
        <p className="text-gray-600 text-base font-bold">
          {formatExpirationDate(
            checkoutData?.prazo_pagamento ||
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          )}
        </p>
      </div>

      {/* Collapsible How-to Section using the new component */}
      <div className="mb-8 w-full max-w-md mx-auto">
        <CollapsibleInstructions
          title="Como funciona?"
          steps={instructionSteps}
        />
      </div>

      <Identifier idTransacao={idTransacao} />

      {/* DEV ONLY: Button to simulate payment approval */}
      <div className="mt-8">
        <Button
          variant="outline"
          onClick={handleApprovePayment}
          disabled={isApproving}
          className="w-full"
        >
          {isApproving ? "Aprovando..." : "Simular Aprovação de Pagamento"}
        </Button>
      </div>
    </div>
  );
}
