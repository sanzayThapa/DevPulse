import { Card, CardHeader } from "@/components/ui/card";

export function ChartCard({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <Card className="min-h-[360px]">
      <CardHeader title={title} eyebrow={eyebrow} />
      <div className="h-72">{children}</div>
    </Card>
  );
}
