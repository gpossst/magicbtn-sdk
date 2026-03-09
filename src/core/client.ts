import {
  getStoredVariant,
  setStoredVariant,
  getStoredWinner,
  setStoredWinner,
} from "./storage";

export interface ExperimentData {
  id: string;
  status: "running" | "winner_selected";
  winnerVariantId: string | null;
  variants: Array<{ id: string; name: string }>;
}

export class ExperimentClient {
  private apiBase: string;
  private apiKey: string;
  private experimentId: string;

  constructor(apiBase: string, apiKey: string, experimentId: string) {
    this.apiBase = apiBase.replace(/\/$/, "");
    this.apiKey = apiKey;
    this.experimentId = experimentId;
  }

  private headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
    };
  }

  async getExperimentData(): Promise<ExperimentData | null> {
    try {
      const res = await fetch(
        `${this.apiBase}/api/experiment/${this.experimentId}`,
        { headers: this.headers() }
      );
      if (!res.ok) return null;
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text) as ExperimentData;
    } catch {
      return null;
    }
  }

  async init(): Promise<{ variantId: string | null; allVariantIds: string[] }> {
    const storedVariant = getStoredVariant(this.experimentId);
    try {
      const res = await fetch(
        `${this.apiBase}/api/experiment/${this.experimentId}`,
        { headers: this.headers() }
      );
      if (!res.ok) {
        return {
          variantId: getStoredWinner(this.experimentId) ?? storedVariant,
          allVariantIds: [],
        };
      }
      const text = await res.text();
      if (!text) {
        return {
          variantId: getStoredWinner(this.experimentId) ?? storedVariant,
          allVariantIds: [],
        };
      }
      const data = JSON.parse(text) as ExperimentData;
      const allVariantIds = data.variants.map((v) => v.id);
      if (data.status === "winner_selected" && data.winnerVariantId) {
        setStoredWinner(this.experimentId, data.winnerVariantId);
        return { variantId: data.winnerVariantId, allVariantIds };
      }
      if (storedVariant) return { variantId: storedVariant, allVariantIds };
      const randomVariant =
        data.variants[Math.floor(Math.random() * data.variants.length)];
      if (!randomVariant) return { variantId: null, allVariantIds };
      setStoredVariant(this.experimentId, randomVariant.id);
      return { variantId: randomVariant.id, allVariantIds };
    } catch {
      return {
        variantId: getStoredWinner(this.experimentId) ?? storedVariant,
        allVariantIds: [],
      };
    }
  }

  async getOrAssignVariant(): Promise<string | null> {
    // If winner is cached locally, return immediately
    const cachedWinner = getStoredWinner(this.experimentId);
    if (cachedWinner) return cachedWinner;

    // Check for existing assignment
    const storedVariant = getStoredVariant(this.experimentId);

    try {
      const res = await fetch(
        `${this.apiBase}/api/experiment/${this.experimentId}`,
        { headers: this.headers() }
      );

      if (!res.ok) return storedVariant;

      const text = await res.text();
      if (!text) return storedVariant;
      const data = JSON.parse(text) as ExperimentData;

      if (data.status === "winner_selected" && data.winnerVariantId) {
        setStoredWinner(this.experimentId, data.winnerVariantId);
        return data.winnerVariantId;
      }

      // Running experiment — use existing assignment or randomly assign
      if (storedVariant) return storedVariant;

      const randomVariant =
        data.variants[Math.floor(Math.random() * data.variants.length)];
      if (!randomVariant) return null;

      setStoredVariant(this.experimentId, randomVariant.id);
      return randomVariant.id;
    } catch {
      return storedVariant;
    }
  }

  async trackImpression(variantId: string): Promise<void> {
    // Don't track if winner already decided
    const winner = getStoredWinner(this.experimentId);
    if (winner) return;

    await fetch(`${this.apiBase}/api/event`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        experimentId: this.experimentId,
        variantId,
        type: "impression",
      }),
    }).catch(() => {
      // Silently ignore tracking errors
    });
  }

  async trackConversion(variantId: string): Promise<void> {
    // Don't track conversions if winner already decided
    const winner = getStoredWinner(this.experimentId);
    if (winner) return;

    await fetch(`${this.apiBase}/api/event`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        experimentId: this.experimentId,
        variantId,
        type: "conversion",
      }),
    }).catch(() => {
      // Silently ignore tracking errors
    });
  }
}
