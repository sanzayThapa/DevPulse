"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BarChart3, Gauge, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { ROLE_META, roleDetails } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/analytics";

type LoginForm = {
  email: string;
  role: Role;
};

const ROLES: Role[] = ["admin", "manager", "viewer"];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<LoginForm>({
    defaultValues: { email: "admin@devpulse.app", role: "admin" }
  });
  const role = watch("role");

  useEffect(() => {
    setValue("email", roleDetails(role).email);
  }, [role, setValue]);

  const onSubmit = (values: LoginForm) => {
    login(values.email, values.role);
    router.push("/dashboard");
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden border-r border-border bg-canvas text-white lg:block">
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-brand-500/30 bg-brand-500 text-white shadow-sm">
              <Gauge className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">DevPulse Cloud</p>
              <p className="text-sm text-subtle">Production analytics platform</p>
            </div>
          </div>

          <div className="max-w-xl">
            <Badge className="border-brand-500/25 bg-brand-500/10 text-brand-300">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Portfolio-ready · Enterprise-grade
            </Badge>
            <h1 className="mt-6 text-5xl font-semibold leading-tight tracking-normal">
              Monitor the whole product pulse from one precise surface.
            </h1>
            <p className="mt-5 text-base leading-7 text-subtle">
              Traffic, revenue, API reliability, error monitoring, and user activity — all in a polished analytics platform with role-based access and AI insights.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["184k visitors", "$92k MRR", "0.42% errors"].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-panel p-4 shadow-soft">
                <p className="text-sm font-semibold">{item}</p>
                <p className="mt-1 text-xs text-subtle">Live demo signal</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="panel w-full max-w-md rounded-lg p-6 sm:p-8">
          <div className="mb-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-brand-500 text-white lg:hidden">
              <Gauge className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold tracking-normal">Welcome back</h2>
            <p className="mt-2 text-sm text-subtle">Choose a demo role and enter the dashboard.</p>
          </div>

          <label className="block text-sm font-medium">
            Email
            <span className="mt-2 flex h-11 items-center gap-2 rounded-md border border-border bg-muted/45 px-3">
              <Mail className="h-4 w-4 text-subtle" />
              <input className="w-full bg-transparent text-sm outline-none" type="email" {...register("email", { required: true })} />
            </span>
          </label>

          <div className="mt-5">
            <p className="text-sm font-medium">Demo role</p>
            <div className="mt-2 space-y-2">
              {ROLES.map((option) => {
                const meta = ROLE_META[option];
                const isSelected = role === option;
                return (
                  <label
                    key={option}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition",
                      isSelected ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10" : "border-border hover:border-brand-500/45"
                    )}
                  >
                    <input className="sr-only" type="radio" value={option} {...register("role")} />
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold capitalize", meta.color)}>
                      {option[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{meta.label}</p>
                      <p className="text-xs text-subtle">{meta.description}</p>
                    </div>
                    {isSelected && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-brand-500" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-6 w-full">
            <LockKeyhole className="h-4 w-4" />
            Sign in to DevPulse Cloud
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-subtle">
            <BarChart3 className="h-3.5 w-3.5" />
            Mock auth stored locally · No real credentials needed
          </div>
        </form>
      </section>
    </main>
  );
}
