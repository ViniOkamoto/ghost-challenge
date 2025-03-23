"use server";

import { ApprovePaymentRequest } from "@/types/approve-payment-request.type";
import { PaymentStatusResponse } from "@/types/payment-status-response.type";

/**
 * Helper to log and process API responses
 */
async function processApiResponse(response: Response) {
  // Clone the response so we can read it multiple times
  const clonedResponse = response.clone();

  // Try to parse the response body regardless of status code
  let responseBody;
  try {
    responseBody = await clonedResponse.text();
    console.log("Raw API response:", responseBody);

    // Try to parse as JSON if possible
    try {
      responseBody = JSON.parse(responseBody);
      console.log("Parsed API response:", responseBody);
    } catch {
      // Not JSON, keep as text
    }
  } catch (e) {
    console.log("Could not read response body:", e);
  }

  return { response, responseBody };
}

/**
 * Server action to approve a payment
 */
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

    const { responseBody } = await processApiResponse(response);

    if (!response.ok) {
      throw new Error(
        `Failed to approve payment: ${response.status} ${response.statusText}${
          responseBody ? ` - ${JSON.stringify(responseBody)}` : ""
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Payment approval failed:", error);
    throw error;
  }
}

/**
 * Server action to get payment status
 */
export async function getPaymentStatus(
  transactionId: string
): Promise<PaymentStatusResponse> {
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

    const { responseBody } = await processApiResponse(response);

    if (!response.ok) {
      throw new Error(
        `Failed to get payment status: ${response.status} ${
          response.statusText
        }${responseBody ? ` - ${JSON.stringify(responseBody)}` : ""}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Get payment status failed:", error);
    throw error;
  }
}
