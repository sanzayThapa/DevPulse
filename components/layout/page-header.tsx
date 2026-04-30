export function PageHeader({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium text-brand-600 dark:text-brand-100">DevPulse Analytics</p>
        <h1 className="mt-2 text-2xl font-bold tracking-normal text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-subtle">{description}</p>
      </div>
      {children}
    </div>
  );
}
