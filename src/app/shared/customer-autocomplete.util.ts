/** Customer autocomplete helpers — keep mat-option [value] and TS handlers in sync. */

export interface CustomerAutocompleteItem {
  customerID?: number;
  customerName?: string;
  customerIdentityNumber?: string;
}

export function getCustomerDisplayValue(customer: CustomerAutocompleteItem): string {
  return `${customer?.customerName || ''}##${customer?.customerIdentityNumber || ''}`;
}

export function getCustomerNameFromAutocomplete(value: unknown): string {
  const raw = (value ?? '').toString().trim();
  if (!raw) {
    return raw;
  }
  return raw.split('##')[0].trim();
}

export function resolveCustomerFromAutocomplete<T extends CustomerAutocompleteItem>(
  value: unknown,
  list: T[] | null | undefined
): T | null {
  if (!value || !list?.length) {
    return null;
  }

  const trimmed = value.toString().trim();
  if (!trimmed) {
    return null;
  }

  const byDisplay = list.find((c) => getCustomerDisplayValue(c) === trimmed);
  if (byDisplay) {
    return byDisplay;
  }

  if (trimmed.includes('##')) {
    const parts = trimmed.split('##');
    const name = (parts[0] || '').trim();
    const identity = (parts[1] || '').trim();
    const byNameIdentity = list.find(
      (c) =>
        (c.customerName || '') === name &&
        (c.customerIdentityNumber || '').toString() === identity
    );
    if (byNameIdentity) {
      return byNameIdentity;
    }
    const byNameOnly = list.find((c) => (c.customerName || '') === name);
    if (byNameOnly) {
      return byNameOnly;
    }
  }

  return list.find((c) => (c.customerName || '') === trimmed) || null;
}
