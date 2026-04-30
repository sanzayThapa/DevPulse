"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { BarChart3, Gauge, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/types/analytics";

type LoginForm = {
  email: string;
  role: Role;
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<LoginForm>({
    defaultValues: { email: "admin@devpulse.app", role: "admin" }
  });
  const role = watch("role");

  useEffect(() => {
    setValue("email", role === "admin" ? "admin@devpulse.app" : "user@devpulse.app");
  }, [role, setValue]);

  const onSubmit = (values: LoginForm) => {
    login(values.email, values.role);
    router.push("/dashboard");
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden border-r border-border bg-ink-950 text-white lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,182,212,.28),transparent_38%),linear-gradient(45deg,rgba(16,185,129,.18),transparent_42%)]" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-ink-950">
              <Gauge className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">DevPulse</p>
              <p className="text-sm text-slate-300">Real-time analytics SaaS</p>
            </div>
          </div>

          <div className="max-w-xl">
            <Badge className="border-white/15 bg-white/10 text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Portfolio-ready dashboard
            </Badge>
            <h1 className="mt-6 text-5xl font-bold tracking-normal">Monitor the whole product pulse from one precise surface.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Traffic, revenue, API reliability, conversion, and user activity update in a polished interface designed for screenshots and real product workflows.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {["184k visitors", "$92k MRR", "0.42% errors"].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                <p className="text-sm font-semibold">{item}</p>
                <p className="mt-1 text-xs text-slate-400">Live demo signal</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="panel w-full max-w-md rounded-2xl p-6 sm:p-8">
          <div className="mb-8">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-foreground text-canvas dark:bg-white dark:text-ink-950 lg:hidden">
              <Gauge className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-normal">Welcome back</h2>
            <p className="mt-2 text-sm text-subtle">Choose a demo role and enter the dashboard.</p>
          </div>

          <label className="block text-sm font-medium">
            Email
            <span className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3">
              <Mail className="h-4 w-4 text-subtle" />
              <input className="w-full bg-transparent text-sm outline-none" type="email" {...register("email", { required: true })} />
            </span>
          </label>

          <div className="mt-5">
            <p className="text-sm font-medium">Demo role</p>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/50 p-1">
              {(["admin", "user"] as Role[]).map((option) => (
                <label
                  key={option}
                  className={`focus-ring flex h-10 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold capitalize transition ${role === option ? "bg-panel shadow-sm" : "text-subtle hover:text-foreground"}`}
                >
                  <input className="sr-only" type="radio" value={option} {...register("role")} />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" className="mt-6 w-full">
            <LockKeyhole className="h-4 w-4" />
            Sign in to DevPulse
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-subtle">
            <BarChart3 className="h-3.5 w-3.5" />
            Mock auth stored locally for demo mode
          </div>
        </form>
      </section>
    </main>
  );
}
