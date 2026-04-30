"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "@/types/analytics";

type AuthState = {
  isAuthenticated: boolean;
  role: Role;
  name: string;
  email: string;
};

type AuthContextValue = AuthState & {
  login: (email: string, role: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
};

const defaultState: AuthState = {
  isAuthenticated: false,
  role: "admin",
  name: "DevPulse Admin",
  email: "admin@devpulse.app"
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function roleDetails(role: Role) {
  return role === "admin"
    ? { name: "DevPulse Admin", email: "admin@devpulse.app" }
    : { name: "DevPulse User", email: "user@devpulse.app" };
}

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
          email
        }),
      logout: () => setState({ ...defaultState, isAuthenticated: false }),
      setRole: (role) =>
        setState((current) => ({
          ...current,
          role,
          ...roleDetails(role)
        }))
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
