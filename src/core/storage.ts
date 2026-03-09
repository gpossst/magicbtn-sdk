const PREFIX = "magicbtn:";

export function getStoredVariant(experimentId: string): string | null {
  try {
    return localStorage.getItem(`${PREFIX}${experimentId}:variant`);
  } catch {
    return null;
  }
}

export function setStoredVariant(experimentId: string, variantId: string): void {
  try {
    localStorage.setItem(`${PREFIX}${experimentId}:variant`, variantId);
  } catch {
    // Ignore SecurityError / QuotaExceededError
  }
}

export function getStoredWinner(experimentId: string): string | null {
  try {
    return localStorage.getItem(`${PREFIX}${experimentId}:winner`);
  } catch {
    return null;
  }
}

export function setStoredWinner(experimentId: string, winnerId: string): void {
  try {
    localStorage.setItem(`${PREFIX}${experimentId}:winner`, winnerId);
  } catch {
    // Ignore SecurityError / QuotaExceededError
  }
}
