import { SecurityIcon } from "@/components/atoms/icons/security";

import { GhostsPayIcon } from "@/components/atoms/logo";
import { cn } from "@/lib/utils";

type SecurityDisclaimerProps = {
  className?: string;
};

export function SecurityDisclaimer({ className }: SecurityDisclaimerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center text-gray-500 text-sm">
        <SecurityIcon className="h-5 w-5 mr-2" />
        Pagamento 100% seguro via:
        <GhostsPayIcon className="h-5 w-5 ml-2" />
      </div>
    </div>
  );
}
