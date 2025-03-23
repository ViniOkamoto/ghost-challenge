import { GhostsPayLogo } from "@/components/atoms/logo";
import CheckoutForm from "@/components/molecule/checkout-form";

export default function CheckoutPage() {
  return (
    <>
      <div className="bg-primary font-semibold text-sm text-white py-2 text-center  mb-6">
        FRETE GRÁTIS ACIMA DE 200 REAIS
      </div>

      <div className="flex justify-center mb-10">
        <GhostsPayLogo />
      </div>
      <CheckoutForm />
    </>
  );
}
