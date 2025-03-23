import { cn } from "@/lib/utils";

export function InformationCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white relative rounded-sm p-4 border-2 border-gray-200 pt-8">
      <label className="bg-gray-200 text-gray-900 px-5 py-1 absolute rounded-full inline-block font-bold z-10 left-4 -top-0.5 transform -translate-y-1/2">
        {label}
      </label>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

export function InformationCardRow({
  label,
  value,
  className,
  labelClassName = "text-gray-500",
  valueClassName = "text-gray-900",
}: {
  label: string;
  value: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-row justify-between items-center gap-4",
        className
      )}
    >
      <p className={cn("font-medium", labelClassName)}>{label}</p>
      <p className={cn("font-bold", valueClassName)}>{value}</p>
    </div>
  );
}
