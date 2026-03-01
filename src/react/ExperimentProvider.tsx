import { createContext, useContext, type ReactNode } from "react";
import { ExperimentClient } from "../core/client";

interface ExperimentContextValue {
  client: ExperimentClient;
}

const ExperimentContext = createContext<ExperimentContextValue | null>(null);

export function ExperimentProvider({
  client,
  children,
}: {
  client: ExperimentClient;
  children: ReactNode;
}) {
  return (
    <ExperimentContext.Provider value={{ client }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperimentClient(): ExperimentClient {
  const ctx = useContext(ExperimentContext);
  if (!ctx) {
    throw new Error("useExperimentClient must be used within ExperimentProvider");
  }
  return ctx.client;
}
