"use server";

import { CheckoutRequestData } from "@/models/checkout-request";
import { CheckoutResponse } from "@/models/checkout-response";

export async function createCheckout(
  data: CheckoutRequestData
): Promise<CheckoutResponse> {
  try {
    console.log("Sending checkout request:", JSON.stringify(data, null, 2));

    const payload = {
      ...data,
      telefone: data.telefone.replace(/\D/g, ""),
      cpf: data.cpf.replace(/\D/g, ""),
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
