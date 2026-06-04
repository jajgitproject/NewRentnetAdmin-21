/** True when booking has an active allotment (soft or hard). */
export function isAllotedBooking(item: any): boolean {
  if (!item) {
    return false;
  }
  const status = (item?.allotmentStatus ?? item?.AllotmentStatus ?? '')
    .toString()
    .trim()
    .toLowerCase();
  return status === 'alloted' || status.includes('alloted');
}

/** True for Hard allotment — used where auto/manual messaging applies to hard allot only. */
export function isHardAllotedBooking(item: any): boolean {
  if (!item) {
    return false;
  }
  const status = (item?.allotmentStatus ?? item?.AllotmentStatus ?? '')
    .toString()
    .trim()
    .toLowerCase();
  const type = (item?.allotmentType ?? item?.AllotmentType ?? '')
    .toString()
    .trim()
    .toLowerCase();

  if (type === 'hard' && (status === 'alloted' || status.startsWith('alloted'))) {
    return true;
  }
  if (status.includes('alloted') && status.includes('hard')) {
    return true;
  }

  const details = item?.allotmentStatusDetails;
  if (Array.isArray(details) && details.length > 0) {
    const latest = details[details.length - 1];
    const dStatus = (latest?.allotmentStatus ?? '')
      .toString()
      .trim()
      .toLowerCase();
    const dType = (latest?.allotmentType ?? '').toString().trim().toLowerCase();
    if (dStatus === 'alloted' && dType === 'hard') {
      return true;
    }
  }

  return false;
}

/** India (91): strict 10-digit local. International: non-empty trim pass-through. */
export function isValidEmail(raw: string | null | undefined): boolean {
  const email = (raw ?? '').toString().trim();
  if (!email) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isIndianMobile(raw: string | null | undefined): boolean {
  const text = (raw ?? '').toString().trim();
  if (!text) {
    return false;
  }

  let cleaned = text.replace(/\s+/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.includes('-')) {
    const parts = cleaned.split('-').filter((x) => x !== '');
    if (parts.length >= 2) {
      const country = parts[0].replace(/\D/g, '');
      if (country === '91' || country === '091') {
        return true;
      }
      if (country.length > 0 && country !== '91') {
        return false;
      }
    }
  }

  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10) {
    return true;
  }
  if (digits.length >= 12 && digits.startsWith('91')) {
    return true;
  }
  if (digits.length > 10 && digits.startsWith('91')) {
    return true;
  }

  return false;
}

/** Returns normalized mobile for API, or null if invalid/empty. International returns trimmed raw. */
export function normalizeMobileForMessaging(mobile: string | null | undefined): string | null {
  const raw = (mobile ?? '').toString().trim();
  if (!raw) {
    return null;
  }

  if (!isIndianMobile(raw)) {
    return raw.replace(/\s+/g, '') || null;
  }

  let cleaned = raw.replace(/\s+/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.includes('-')) {
    const parts = cleaned.split('-').filter((x) => x !== '');
    if (parts.length >= 2) {
      const country = parts[0].replace(/\D/g, '');
      const number = parts.slice(1).join('').replace(/\D/g, '');
      if ((country === '91' || country === '091') && number.length === 10) {
        return `91-${number}`;
      }
    }
    return null;
  }

  const digits = cleaned.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91-${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `91-${digits.substring(2)}`;
  }
  if (digits.length >= 12 && digits.startsWith('91')) {
    return `91-${digits.substring(digits.length - 10)}`;
  }

  return null;
}
