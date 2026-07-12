import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[0.8125rem] font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-navy)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary-navy)] text-white hover:bg-[var(--primary-navy-hover)] active:bg-[var(--primary-navy-active)]",
        destructive:
          "bg-[var(--status-danger)] text-white hover:bg-[var(--status-danger)]/90",
        outline:
          "border border-[var(--border-default)] bg-[var(--elevated)] text-[var(--text-primary)] hover:bg-[var(--canvas)] hover:border-[var(--border-strong)]",
        secondary:
          "border border-[var(--border-default)] bg-[var(--elevated)] text-[var(--text-primary)] hover:bg-[var(--canvas)]",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]",
        link: "text-[var(--primary-navy)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-[10px] gap-1.5 px-3 has-[>svg]:px-2.5 text-[0.75rem]",
        lg: "h-10 rounded-[10px] px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
