import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-card text-card-foreground border border-border shadow-sm flex flex-col gap-4 overflow-hidden transition-all",
  {
    variants: {
      width: {
        xs: "w-full md:max-w-xs",
        sm: "w-full md:max-w-sm",
        md: "w-full max-w-md",
        lg: "w-full max-w-lg",
        xl: "w-full max-w-xl",
        "2xl": "w-full max-w-2xl",
        full: "w-full",
        auto: "w-auto max-w-none",
      },
      size: {
        default: "p-8  rounded-xl",
        sm: "p-4 rounded-lg ",
        none: "p-0 rounded-none",
      },
    },
    defaultVariants: {
      width: "sm",
      size: "default",
    },
  },
);

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {}

function Card({ className, width, size, ...props }: CardProps) {
  return <div data-slot="card" className={cn(cardVariants({ width, size, className }))} {...props} />;
}

export { Card, cardVariants };
