import { SecurityDisclaimer } from "@/components/molecule/security-disclaimer";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col pb-8">
      {children}
      <SecurityDisclaimer className="mt-4" />
    </div>
  );
}
