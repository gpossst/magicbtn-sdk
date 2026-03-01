const PREFIX = "magicbtn:";

export function getStoredVariant(experimentId: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(`${PREFIX}${experimentId}:variant`);
}

export function setStoredVariant(experimentId: string, variantId: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(`${PREFIX}${experimentId}:variant`, variantId);
}

export function getStoredWinner(experimentId: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(`${PREFIX}${experimentId}:winner`);
}

export function setStoredWinner(experimentId: string, winnerId: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(`${PREFIX}${experimentId}:winner`, winnerId);
}
