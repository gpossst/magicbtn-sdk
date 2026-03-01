import type { ReactNode } from "react";
import { useVariantContext } from "./context";

export function Variant({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  const { activeVariantId } = useVariantContext();

  // id is injected by Experiment when omitted (auto-variant by position)
  if (!id || activeVariantId !== id) return null;
  return <>{children}</>;
}
