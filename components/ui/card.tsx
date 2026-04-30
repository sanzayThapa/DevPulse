import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("panel rounded-xl p-5 transition hover:shadow-glow", className)}>{children}</section>;
}

export function CardHeader({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-100">{eyebrow}</p> : null}
        <h2 className="mt-1 text-base font-semibold text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  );
}
