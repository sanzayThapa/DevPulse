import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("panel rounded-lg p-5 transition-colors hover:border-brand-500/25", className)}>{children}</section>;
}

export function CardHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">{eyebrow}</p> : null}
        <h2 className="mt-1 text-[15px] font-semibold text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  );
}
