"use client";

import { useState } from "react";
import { Activity, BarChart3, Check, ChevronRight, Gauge, Globe, TrendingUp, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;

const PROJECT_TYPES = [
  { id: "saas", label: "SaaS Product", icon: Gauge, description: "Subscriptions, MRR, churn" },
  { id: "api", label: "API Platform", icon: Zap, description: "Endpoints, latency, errors" },
  { id: "ecommerce", label: "E-commerce", icon: TrendingUp, description: "Orders, GMV, conversion" },
  { id: "content", label: "Content / Media", icon: Globe, description: "Traffic, engagement, ads" }
];

const METRIC_OPTIONS = [
  { id: "traffic", label: "Traffic & Visitors", icon: Globe },
  { id: "revenue", label: "Revenue & MRR", icon: TrendingUp },
  { id: "api", label: "API Performance", icon: Zap },
  { id: "users", label: "User Activity", icon: Activity },
  { id: "errors", label: "Error Monitoring", icon: BarChart3 }
];

export function OnboardingWizard() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState<Step>(0);
  const [workspace, setWorkspace] = useState("DevPulse Cloud");
  const [projectType, setProjectType] = useState("saas");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["traffic", "revenue", "api"]);

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const steps = [
    { label: "Workspace", description: "Name your workspace" },
    { label: "Project type", description: "What are you building?" },
    { label: "Metrics", description: "Choose what to track" },
    { label: "Ready", description: "All set!" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg rounded-lg border border-border bg-panel shadow-elevated">
        {/* Step indicator */}
        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition",
                  i < step ? "bg-brand-500 text-white" : i === step ? "border-2 border-brand-500 text-brand-600 dark:text-brand-300" : "border border-border text-subtle"
                )}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("h-px w-8 transition", i < step ? "bg-brand-500" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-subtle">Step {step + 1} of {steps.length} — {steps[step].description}</p>
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          {step === 0 && (
            <div>
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-lg bg-brand-500/10">
                <Gauge className="h-6 w-6 text-brand-500" />
              </div>
              <h2 className="text-xl font-bold">Create your workspace</h2>
              <p className="mt-1 text-sm text-subtle">Give your analytics workspace a name. You can change this later.</p>
              <label className="mt-6 block">
                <span className="text-sm font-medium">Workspace name</span>
                <input
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder="Acme Analytics"
                />
              </label>
              <p className="mt-2 text-xs text-subtle">
                Your workspace URL will be <span className="font-mono text-foreground">devpulse.app/{workspace.toLowerCase().replace(/\s+/g, "-")}</span>
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold">What are you building?</h2>
              <p className="mt-1 text-sm text-subtle">We&apos;ll pre-configure dashboards and metrics for your product type.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={cn(
                        "rounded-lg border p-4 text-left transition hover:border-brand-500/45",
                        isSelected ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10" : "border-border"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isSelected ? "text-brand-500" : "text-subtle")} />
                      <p className="mt-2 text-sm font-semibold">{type.label}</p>
                      <p className="mt-0.5 text-xs text-subtle">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold">Select your metrics</h2>
              <p className="mt-1 text-sm text-subtle">Choose which analytics sections to enable for your workspace.</p>
              <div className="mt-6 space-y-2">
                {METRIC_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedMetrics.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleMetric(opt.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition",
                        isSelected ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10" : "border-border hover:border-brand-500/45"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-brand-500" : "text-subtle")} />
                      <span className="text-sm font-medium">{opt.label}</span>
                      {isSelected && <Check className="ml-auto h-4 w-4 text-brand-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40">
                <Check className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold">You&apos;re ready to go!</h2>
              <p className="mt-2 text-sm text-subtle">
                <span className="font-semibold text-foreground">{workspace}</span> is configured with{" "}
                {selectedMetrics.length} analytics section{selectedMetrics.length !== 1 ? "s" : ""}.
              </p>
              <div className="mt-6 rounded-lg border border-border bg-muted/50 px-4 py-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Workspace summary</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-sm"><span className="text-subtle">Name</span><span className="font-medium">{workspace}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-subtle">Type</span><span className="font-medium capitalize">{projectType}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-subtle">Sections</span><span className="font-medium">{selectedMetrics.length} enabled</span></div>
                  <div className="flex justify-between text-sm"><span className="text-subtle">Data</span><span className="font-medium text-emerald-600 dark:text-emerald-400">Live demo mode</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => step === 0 ? completeOnboarding() : setStep((s) => (s - 1) as Step)}
          >
            {step === 0 ? "Skip setup" : "Back"}
          </Button>
          <Button
            variant="primary"
            onClick={() => step === 3 ? completeOnboarding() : setStep((s) => (s + 1) as Step)}
            disabled={step === 2 && selectedMetrics.length === 0}
          >
            {step === 3 ? "Enter Dashboard" : "Continue"}
            {step < 3 && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
