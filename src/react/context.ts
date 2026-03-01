import { createContext, useContext } from "react";
import type { ExperimentClient } from "../core/client";

export interface VariantContextValue {
  activeVariantId: string | null;
  client: ExperimentClient;
  variantIds: string[];
}

export const VariantContext = createContext<VariantContextValue | null>(null);

export function useVariantContext(): VariantContextValue {
  const ctx = useContext(VariantContext);
  if (!ctx) throw new Error("Must be inside <Experiment>");
  return ctx;
}
