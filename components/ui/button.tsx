import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-canvas shadow-sm hover:opacity-90 dark:bg-white dark:text-ink-950",
  secondary: "border border-border bg-panel text-foreground hover:bg-muted",
  ghost: "text-subtle hover:bg-muted hover:text-foreground",
  danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300"
};

export function Button({ className, variant = "secondary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
