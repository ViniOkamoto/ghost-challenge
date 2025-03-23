"use server";

import { ApprovePaymentRequest } from "@/models/approve-payment-request";
import { PaymentStatusResponse } from "@/models/payment-status-response";

export async function approvePayment(
  transactionId: string
): Promise<PaymentStatusResponse> {
  try {
    console.log("Approving payment for transaction:", transactionId);

    const payload: ApprovePaymentRequest = {
      id_transacao: transactionId,
    };

    const response = await fetch(`http://localhost:3333/payment/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to approve payment: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Payment approval failed:", error);
    throw error;
  }
}

export async function getPaymentStatus(
  transactionId: string
): Promise<PaymentStatusResponse | null> {
  try {
    console.log("Getting payment status for transaction:", transactionId);

    const response = await fetch(
      `http://localhost:3333/payment/${transactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to get payment status:", response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Get payment status failed:", error);
    throw error;
  }
}
