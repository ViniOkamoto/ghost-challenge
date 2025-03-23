import { FormControl, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/types/schema";
import { PaymentType } from "@/models/checkout-request";
type CreditCardOptionsProps = {
  form: UseFormReturn<PaymentFormValues>;
  isSelected: boolean;
};

export function CreditCardOptions({
  form,
  isSelected,
}: CreditCardOptionsProps) {
  const installments = form.watch("installments");

  const handleOptionClick = (installmentValue: number) => {
    form.setValue("paymentType", PaymentType.CREDIT_CARD);
    form.setValue("installments", installmentValue);
  };

  return (
    <div className="relative">
      <FormLabel className="bg-gray-200 text-gray-900 px-5 py-1 absolute rounded-4xl inline-block font-bold z-10 left-4 -top-0.5 transform -translate-y-1/2">
        Cartão de Crédito
      </FormLabel>
      <div
        className={`border-2 rounded-lg relative overflow-hidden  ${
          isSelected ? "border-primary" : "border-gray-200"
        }`}
      >
        <div className="divide-y ">
          {/* 1x Option */}
          <div
            className={`p-4 ${
              isSelected && installments === 1 ? "bg-primary-50" : "bg-white"
            }`}
            onClick={() => handleOptionClick(1)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <p className="text-lg font-bold">1x</p>
                  <p className="text-lg">R$ 30.500,00</p>
                </div>
                <p className="text-sm text-gray-500">Total: R$ 30.600,00</p>
              </div>
              <FormControl>
                {isSelected && installments === 1 ? (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                )}
              </FormControl>
            </div>
          </div>

          {/* 2x Option */}
          <div
            className={`p-4 ${
              isSelected && installments === 2 ? "bg-primary-50" : "bg-white"
            }`}
            onClick={() => handleOptionClick(2)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <p className="text-lg font-bold">2x</p>
                  <p className="text-lg">R$ 15.325,00</p>
                </div>
                <p className="text-sm text-gray-500">Total: R$ 30.650,00</p>
              </div>
              <FormControl>
                {isSelected && installments === 2 ? (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                )}
              </FormControl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
