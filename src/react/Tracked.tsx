import type { ReactNode, MouseEvent } from "react";
import { useVariantContext } from "./context";

export function Tracked({ children }: { children: ReactNode }) {
  const { activeVariantId, client } = useVariantContext();

  function handleClick(e: MouseEvent) {
    if (activeVariantId) {
      client.trackConversion(activeVariantId);
    }
  }

  return (
    <span onClick={handleClick} style={{ display: "contents" }}>
      {children}
    </span>
  );
}
