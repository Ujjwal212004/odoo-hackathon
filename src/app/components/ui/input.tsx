import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[var(--text-tertiary)] flex h-9 w-full min-w-0 rounded-[10px] border border-[var(--border-default)] bg-[var(--elevated)] px-3 py-1 text-[0.8125rem] text-[var(--text-primary)] transition-all duration-150 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-[var(--border-strong)]",
        "focus-visible:border-[var(--primary-navy)] focus-visible:ring-2 focus-visible:ring-[var(--primary-navy)]/10",
        "aria-invalid:border-[var(--status-danger)] aria-invalid:ring-2 aria-invalid:ring-[var(--status-danger)]/10",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
