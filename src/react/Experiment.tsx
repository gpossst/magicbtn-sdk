import {
  useState,
  useEffect,
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { useExperimentClient } from "./ExperimentProvider";
import { VariantContext } from "./context";
import { Variant } from "./Variant";

export function Experiment({ children }: { children: ReactNode }) {
  const client = useExperimentClient();
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [variantIds, setVariantIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await client.getExperimentData();
      if (!data) return;

      const ids = data.variants.map((v) => v.id);
      setVariantIds(ids);

      const variantId = await client.getOrAssignVariant();
      if (variantId) {
        setActiveVariantId(variantId);
        client.trackImpression(variantId);
      }
    })();
  }, [client]);

  // Auto-inject variant ids by position when Variant has no id prop
  const enhancedChildren =
    variantIds.length > 0
      ? Children.map(children, (child, index) => {
          if (!isValidElement(child) || child.type !== Variant) return child;
          const el = child as ReactElement<{ id?: string; children?: ReactNode }>;
          const id = el.props.id ?? variantIds[index];
          if (!id) return child;
          return cloneElement(el, { id });
        })
      : children;

  return (
    <VariantContext.Provider value={{ activeVariantId, client, variantIds }}>
      {enhancedChildren}
    </VariantContext.Provider>
  );
}

export { useVariantContext } from "./context";
