/** Customer autocomplete helpers — keep mat-option [value] and TS handlers in sync. */

export interface CustomerAutocompleteItem {
  customerID?: number;
  customerName?: string;
  customerIdentityNumber?: string;
  tallyCustomerID?: number | string;
}

export function getCustomerTallyId(customer: CustomerAutocompleteItem): string {
  const tally = customer?.tallyCustomerID;
  if (tally === null || tally === undefined || tally === '' || tally === 0 || tally === '0') {
    return '';
  }

  return tally.toString();
}

export function getCustomerIdValue(customer: CustomerAutocompleteItem): string {
  const customerId = customer?.customerID;
  if (customerId === null || customerId === undefined || customerId <= 0) {
    return '';
  }

  return customerId.toString();
}

export function getCustomerDisplayLabel(customer: CustomerAutocompleteItem): string {
  return `${customer?.customerName || ''}##${getCustomerTallyId(customer)}##${getCustomerIdValue(customer)}`;
}

export function getCustomerDisplayValue(customer: CustomerAutocompleteItem): string {
  return getCustomerDisplayLabel(customer);
}

export function getCustomerNameFromAutocomplete(value: unknown): string {
  const raw = (value ?? '').toString().trim();
  if (!raw) {
    return raw;
  }
  return raw.split('##')[0].trim();
}

export function getCustomerLabelFromAutocomplete(value: unknown): string {
  return (value ?? '').toString().trim();
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
    const tallyId = (parts[1] || '').trim();
    const customerId = (parts[2] || '').trim();

    if (customerId) {
      const byCustomerId = list.find((c) => getCustomerIdValue(c) === customerId);
      if (byCustomerId) {
        return byCustomerId;
      }
    }

    if (name && tallyId) {
      const byNameTally = list.find(
        (c) =>
          (c.customerName || '') === name &&
          getCustomerTallyId(c) === tallyId
      );
      if (byNameTally) {
        return byNameTally;
      }
    }

    const byNameOnly = list.find((c) => (c.customerName || '') === name);
    if (byNameOnly) {
      return byNameOnly;
    }
  }

  return list.find((c) => (c.customerName || '') === trimmed) || null;
}
