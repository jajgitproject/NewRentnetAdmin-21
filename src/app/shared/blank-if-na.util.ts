export function blankIfNa(value: unknown): string {
  if (value === undefined || value === null) {
    return '';
  }

  const text = String(value).trim();
  if (!text || /^n\/?a$/i.test(text)) {
    return '';
  }

  return String(value);
}
