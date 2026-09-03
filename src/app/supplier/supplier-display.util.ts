// @ts-nocheck

export function getSupplierName(supplier: {
  supplierName?: string;
  SupplierName?: string;
}): string {
  return (supplier?.supplierName ?? supplier?.SupplierName ?? '').trim();
}

function getSupplierOldRentnetCode(
  supplier: { oldRentnetCode?: number | string | null; OldRentnetCode?: number | string | null }
): string {
  const code = supplier?.oldRentnetCode ?? supplier?.OldRentnetCode;
  if (code === null || code === undefined || code === '' || Number(code) === 0) {
    return '';
  }
  return String(code);
}

export function normalizeSupplierDropDown(supplier: any) {
  if (!supplier) {
    return null;
  }

  const oldRentnetCode = supplier.oldRentnetCode ?? supplier.OldRentnetCode ?? null;
  return {
    supplierID: supplier.supplierID ?? supplier.SupplierID ?? 0,
    supplierName: getSupplierName(supplier),
    oldRentnetCode: oldRentnetCode === 0 ? null : oldRentnetCode,
    pan: supplier.pan ?? supplier.PAN ?? '',
  };
}

export function normalizeSupplierDropDownList(suppliers: any[] = []) {
  return (suppliers || [])
    .map((supplier) => normalizeSupplierDropDown(supplier))
    .filter((supplier) => supplier);
}

export function formatSupplierCode(supplier: {
  supplierName?: string;
  SupplierName?: string;
  oldRentnetCode?: number | string | null;
  OldRentnetCode?: number | string | null;
  pan?: string | null;
  PAN?: string | null;
}): string {
  const name = getSupplierName(supplier).toUpperCase();
  const code = getSupplierOldRentnetCode(supplier);
  const pan = (supplier?.pan ?? supplier?.PAN ?? '').trim();
  return `${name}#${code}#${pan}`;
}

export function formatDriverDutyRegisterName(driver: {
  driverName?: string;
  oldRentnetCode?: number | string | null;
  mobile1?: string | null;
}): string {
  const name = (driver?.driverName || '').trim();
  if (!name) {
    return '';
  }
  const code = driver?.oldRentnetCode;
  const codeStr =
    code !== null && code !== undefined && code !== '' && code !== 0 ? String(code) : '';
  const mobile = (driver?.mobile1 || '').replace(/-/g, '').trim();
  return `${name}__${codeStr}#${mobile}`;
}

export function formatSupplierDisplay(supplier: {
  supplierName?: string;
  SupplierName?: string;
  oldRentnetCode?: number | string | null;
  OldRentnetCode?: number | string | null;
}): string {
  const name = (supplier?.supplierName ?? supplier?.SupplierName ?? '').trim();
  const code = getSupplierOldRentnetCode(supplier);
  return code ? `${name}#${code}` : name;
}

export function supplierMatchesDisplay(
  supplier: {
    supplierName?: string;
    SupplierName?: string;
    oldRentnetCode?: number | string | null;
    OldRentnetCode?: number | string | null;
    pan?: string | null;
    PAN?: string | null;
  },
  displayValue: string
): boolean {
  const normalized = (displayValue || '').trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const formattedCode = formatSupplierCode(supplier).toLowerCase();
  if (formattedCode === normalized) {
    return true;
  }

  const formattedDisplay = formatSupplierDisplay(supplier).toLowerCase();
  if (formattedDisplay === normalized) {
    return true;
  }

  const name = getSupplierName(supplier).toLowerCase();
  if (name === normalized) {
    return true;
  }

  const code = getSupplierOldRentnetCode(supplier).toLowerCase();
  if (code && code === normalized) {
    return true;
  }

  if (code && `${name}#${code}` === normalized) {
    return true;
  }

  return false;
}

export function getSupplierFilterMinLength(value: string): number {
  const trimmed = (value || '').toString().trim();
  return /^\d+$/.test(trimmed) ? 2 : 3;
}

export function resolveSupplierSearchTerm(
  suppliers: Array<{ supplierName?: string; oldRentnetCode?: number | string | null; pan?: string | null }>,
  value: string
): string {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return '';
  }

  const hashIndex = trimmed.lastIndexOf('#');
  if (hashIndex >= 0) {
    const codePart = trimmed.slice(hashIndex + 1).trim();
    if (codePart) {
      return codePart;
    }
    const namePart = trimmed.slice(0, hashIndex).trim();
    if (namePart) {
      return namePart;
    }
  }

  const normalized = trimmed.toLowerCase();
  const exactCodeMatch = (suppliers || []).find((supplier) => {
    const code = getSupplierOldRentnetCode(supplier).toLowerCase();
    return code && code === normalized;
  });
  if (exactCodeMatch) {
    return getSupplierOldRentnetCode(exactCodeMatch);
  }

  const exactMatch = (suppliers || []).find((supplier) => supplierMatchesDisplay(supplier, trimmed));
  if (exactMatch) {
    const code = getSupplierOldRentnetCode(exactMatch);
    if (code && normalized === code.toLowerCase()) {
      return code;
    }
    return getSupplierName(exactMatch);
  }

  return trimmed;
}

export function filterSuppliersByDisplay(
  suppliers: Array<{
    supplierName?: string;
    SupplierName?: string;
    oldRentnetCode?: number | string | null;
    OldRentnetCode?: number | string | null;
    pan?: string | null;
    PAN?: string | null;
  }>,
  value: string
): Array<{
  supplierName?: string;
  SupplierName?: string;
  oldRentnetCode?: number | string | null;
  OldRentnetCode?: number | string | null;
  pan?: string | null;
  PAN?: string | null;
}> {
  const filterValue = (value || '').trim().toLowerCase();
  if (!filterValue) {
    return [];
  }

  if (filterValue.length < getSupplierFilterMinLength(filterValue)) {
    return [];
  }

  return (suppliers || []).filter((supplier) => {
    const name = getSupplierName(supplier).toLowerCase();
    const pan = (supplier.pan ?? supplier.PAN ?? '').toLowerCase();
    const code = getSupplierOldRentnetCode(supplier).toLowerCase();

    return (
      formatSupplierCode(supplier).toLowerCase().includes(filterValue) ||
      formatSupplierDisplay(supplier).toLowerCase().includes(filterValue) ||
      name.includes(filterValue) ||
      code.includes(filterValue) ||
      pan.includes(filterValue)
    );
  });
}
