export function formatQcVerdict(verdict: string | null | undefined): string {
  if (verdict == null || String(verdict).trim() === '') {
    return '';
  }
  const normalized = String(verdict).trim().toLowerCase();
  if (normalized === 'good') {
    return 'Verdict - Good';
  }
  if (normalized === 'bad') {
    return 'Verdict - Bad';
  }
  const label = String(verdict).trim();
  const titleCased = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  return `Verdict - ${titleCased}`;
}

export function qcVerdictBorderClass(verdict: string | null | undefined): string {
  const value = String(verdict ?? '').trim().toLowerCase();
  if (value === 'good') {
    return 'is-good';
  }
  if (value === 'bad') {
    return 'is-bad';
  }
  return '';
}
