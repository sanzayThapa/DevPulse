"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "@/types/analytics";
import { roleDetails } from "@/lib/roles";

type AuthState = {
  isAuthenticated: boolean;
  role: Role;
  name: string;
  email: string;
  hasCompletedOnboarding: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, role: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
  completeOnboarding: () => void;
};

const defaultState: AuthState = {
  isAuthenticated: false,
  role: "admin",
  name: "DevPulse Admin",
  email: "admin@devpulse.app",
  hasCompletedOnboarding: false
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeDemoState(state: AuthState): AuthState {
  const details = roleDetails(state.role);
  return {
    ...state,
    name: details.name,
    email: state.email.includes("@devpulse.app") ? details.email : state.email
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    const saved = localStorage.getItem("devpulse-auth");
    if (saved) {
      setState(normalizeDemoState(JSON.parse(saved) as AuthState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("devpulse-auth", JSON.stringify(state));
  }, [state]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: (email, role) =>
        setState({
          isAuthenticated: true,
          role,
          name: roleDetails(role).name,
          email,
          hasCompletedOnboarding: false
        }),
      logout: () => setState({ ...defaultState, isAuthenticated: false }),
      setRole: (role) =>
        setState((current) => ({
          ...current,
          role,
          ...roleDetails(role)
        })),
      completeOnboarding: () =>
        setState((current) => ({ ...current, hasCompletedOnboarding: true }))
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
