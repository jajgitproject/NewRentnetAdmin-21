// @ts-nocheck
/** Normalize API/DB status to null when empty (backward compatible with legacy NULL columns). */
export function normalizeStatusValue(status: any): string | null {
  if (status == null || status === undefined) return null;
  const s = String(status).trim();
  if (!s || s.toLowerCase() === 'null' || s === '—' || s === '-') return null;
  return s;
}

/** Pending = null, blank, legacy "Pending Verification", or display dash. */
export function isPendingVerificationStatus(status: any): boolean {
  const normalized = normalizeStatusValue(status);
  if (normalized === null) return true;
  return normalized.toLowerCase() === 'pending verification';
}

export function isVerifiedStatus(status: any): boolean {
  const normalized = normalizeStatusValue(status);
  return normalized != null && normalized.toLowerCase() === 'verified';
}

export function isRejectedStatus(status: any): boolean {
  const normalized = normalizeStatusValue(status);
  return normalized != null && normalized.toLowerCase() === 'rejected';
}

export function formatVerificationStatusDisplay(status: any): string {
  if (isPendingVerificationStatus(status)) return '—';
  return normalizeStatusValue(status) || '—';
}
