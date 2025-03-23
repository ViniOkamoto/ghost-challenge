import { RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { PaymentType } from "@/models/checkout-request";
import { ReactNode } from "react";

export type PaymentOptionProps = {
  label: string;
  value: PaymentType;
  isSelected: boolean;
  children?: ReactNode;
  onClick?: () => void;
};

export function PaymentOption({
  label,
  value,
  isSelected,
  children,
  onClick,
}: PaymentOptionProps) {
  return (
    <FormItem
      className={
        "relative rounded-sm " + (isSelected ? "bg-primary-50" : "bg-white")
      }
    >
      <div
        className={`border-2 rounded-lg p-4 relative
          ${isSelected ? "border-primary" : "border-gray-200"}`}
        onClick={onClick}
      >
        <FormLabel className="bg-gray-200 text-gray-900 px-5 py-1 absolute rounded-4xl inline-block font-bold z-10 left-4 top-0 transform -translate-y-1/2">
          {label}
        </FormLabel>

        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            {/* Payment option content will be rendered here */}
            {children}
          </div>
          <FormControl>
            {isSelected ? (
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
              <RadioGroupItem
                value={value}
                className="w-6 h-6 border-2 border-gray-300"
              />
            )}
          </FormControl>
        </div>
      </div>
    </FormItem>
  );
}
