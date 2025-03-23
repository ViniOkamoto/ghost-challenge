"use server";

import { CheckoutRequestData } from "@/types/checkout-request.type";
import { CheckoutResponse } from "@/types/checkout-response.type";

/**
 * Server action to create a checkout
 */
export async function createCheckout(
  data: CheckoutRequestData
): Promise<CheckoutResponse> {
  try {
    console.log("Sending checkout request:", JSON.stringify(data, null, 2));

    // Ensure the data is properly formatted for the API
    const payload = {
      ...data,
      // Make sure phone and CPF have no special characters
      telefone: data.telefone.replace(/\D/g, ""),
      cpf: data.cpf.replace(/\D/g, ""),
      // Ensure valor is a number
      valor:
        typeof data.valor === "string" ? parseInt(data.valor, 10) : data.valor,
    };

    const response = await fetch(`http://localhost:3333/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create checkout: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Checkout creation failed:", error);
    throw error;
  }
}
