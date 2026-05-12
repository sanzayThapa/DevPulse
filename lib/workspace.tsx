"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type WorkspaceId = "production" | "marketing" | "mobile" | "staging";

export type Workspace = {
  id: WorkspaceId;
  name: string;
  description: string;
  initials: string;
  multiplier: number;
};

export const workspaces: Workspace[] = [
  { id: "production", name: "Production", description: "Live customer traffic", initials: "PR", multiplier: 1 },
  { id: "marketing", name: "Marketing", description: "Campaign and funnel data", initials: "MK", multiplier: 0.62 },
  { id: "mobile", name: "Mobile App", description: "iOS and Android usage", initials: "MA", multiplier: 0.78 },
  { id: "staging", name: "Staging", description: "Pre-release validation", initials: "ST", multiplier: 0.18 }
];

type WorkspaceContextValue = {
  workspace: Workspace;
  setWorkspaceId: (id: WorkspaceId) => void;
  workspaces: Workspace[];
};

const STORAGE_KEY = "devpulse-workspace";
const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

function getWorkspace(id: string | null): Workspace {
  return workspaces.find((workspace) => workspace.id === id) ?? workspaces[0];
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaceId, setWorkspaceIdState] = useState<WorkspaceId>("production");

  useEffect(() => {
    setWorkspaceIdState(getWorkspace(localStorage.getItem(STORAGE_KEY)).id);
  }, []);

  const setWorkspaceId = (id: WorkspaceId) => {
    setWorkspaceIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspace: getWorkspace(workspaceId),
      setWorkspaceId,
      workspaces
    }),
    [workspaceId]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return value;
}

