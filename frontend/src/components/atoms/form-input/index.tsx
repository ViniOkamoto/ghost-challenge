import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ChangeEvent, useCallback } from "react";

export type AppInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "form" | "name"
>;

export type AppInputPropsWithLabel<
  TFieldValues extends FieldValues = FieldValues
> = AppInputProps & {
  label: string;
  form: UseFormReturn<TFieldValues>;
  name: Path<TFieldValues>;
  placeholder?: string;
  mask?: string;
};

// Simple masking function for phone and CPF
const applyMask = (value: string, mask: string) => {
  let result = "";
  let valueIndex = 0;

  for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
    if (mask[i] === "9") {
      if (/\d/.test(value[valueIndex])) {
        result += value[valueIndex];
        valueIndex++;
      } else {
        valueIndex++;
        i--;
      }
    } else {
      result += mask[i];
    }
  }

  return result;
};

export function FormInput<TFieldValues extends FieldValues = FieldValues>({
  label,
  form,
  name,
  placeholder = "Digite aqui...",
  mask,
  ...props
}: AppInputPropsWithLabel<TFieldValues>) {
  // Handle masked input change
  const handleMaskedChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      onChange: (event: ChangeEvent<HTMLInputElement>) => void
    ) => {
      if (!mask) {
        onChange(e);
        return;
      }

      // Get raw input value without any special characters
      const rawValue = e.target.value.replace(/\D/g, "");

      // Apply the mask to the raw value
      if (mask === "(99) 99999-9999") {
        // Phone mask
        const maskedValue = applyMask(rawValue, "(99) 99999-9999");
        e.target.value = maskedValue;
        onChange(e);
      } else if (mask === "999.999.999-99") {
        // CPF mask
        const maskedValue = applyMask(rawValue, "999.999.999-99");
        e.target.value = maskedValue;
        onChange(e);
      } else {
        onChange(e);
      }
    },
    [mask]
  );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel className="bg-gray-200 text-gray-900 left-4 top-0 transform -translate-y-1/2 px-5 py-1 absolute rounded-4xl inline-block font-bold z-10">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              {...props}
              onChange={(e) => handleMaskedChange(e, field.onChange)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
