export function isNightCountProvided(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function toNightCount(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return 0;
  }
  return Math.max(0, Math.trunc(n));
}

export function calculateNightChargesAmount(perNightRate: unknown, nights: unknown): number {
  const rate = Number(perNightRate);
  const count = toNightCount(nights);
  if (!Number.isFinite(rate) || count === 0) {
    return 0;
  }
  return rate * count;
}

export function resolveEffectiveTotalNights(editedNights: unknown, autoNights: unknown): number {
  if (isNightCountProvided(editedNights)) {
    return toNightCount(editedNights);
  }
  return toNightCount(autoNights);
}
