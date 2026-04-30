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
  name: "Maya Chen",
  email: "maya@devpulse.app"
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);

  useEffect(() => {
    const saved = localStorage.getItem("devpulse-auth");
    if (saved) {
      setState(JSON.parse(saved) as AuthState);
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
          name: role === "admin" ? "Maya Chen" : "Leo Martin",
          email
        }),
      logout: () => setState({ ...defaultState, isAuthenticated: false }),
      setRole: (role) =>
        setState((current) => ({
          ...current,
          role,
          name: role === "admin" ? "Maya Chen" : "Leo Martin",
          email: role === "admin" ? "maya@devpulse.app" : "leo@devpulse.app"
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
