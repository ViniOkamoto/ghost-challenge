import React from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface InstructionStep {
  step: string | number;
  description: string;
  className?: string;
}

export interface CollapsibleInstructionsProps {
  title: string;
  steps: InstructionStep[];
  className?: string;
  maxWidth?: string;
}

export function CollapsibleInstructions({
  title,
  steps,
  className = "",
  maxWidth = "100%",
}: CollapsibleInstructionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      style={{ maxWidth, width: "100%" }}
      className={`border-y-2 border-gray-200 py-4 ${className}`}
    >
      <div className="w-full">
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <div className="relative h-10 w-full">
            <CollapsibleTrigger className="w-full h-10 flex items-center justify-between px-4 rounded-md">
              <span className="font-bold text-gray-800">{title}</span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
          </div>

          <div className="w-full">
            <CollapsibleContent className="mt-2 p-4 rounded-b-md overflow-hidden">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`${index < steps.length - 1 ? "mb-4" : ""}`}
                >
                  <div
                    className={`bg-primary-900 text-white px-6 py-1 rounded-md mb-2 inline-block ${
                      index === steps.length - 1 ? "bg-primary-dark" : ""
                    } ${step.className || ""}`}
                  >
                    {typeof step.step === "number"
                      ? `PASSO ${step.step}`
                      : step.step}
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
