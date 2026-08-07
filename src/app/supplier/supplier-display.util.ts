// @ts-nocheck

export function formatSupplierCode(supplier: {
  supplierName?: string;
  oldRentnetCode?: number | string | null;
  pan?: string | null;
}): string {
  const name = (supplier?.supplierName || '').trim().toUpperCase();
  const code =
    supplier?.oldRentnetCode !== null &&
    supplier?.oldRentnetCode !== undefined &&
    supplier?.oldRentnetCode !== '' &&
    Number(supplier.oldRentnetCode) !== 0
      ? String(supplier.oldRentnetCode)
      : '';
  const pan = (supplier?.pan || '').trim();
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
  oldRentnetCode?: number | string | null;
}): string {
  const name = (supplier?.supplierName || '').trim();
  const code =
    supplier?.oldRentnetCode !== null &&
    supplier?.oldRentnetCode !== undefined &&
    supplier?.oldRentnetCode !== '' &&
    Number(supplier.oldRentnetCode) !== 0
      ? String(supplier.oldRentnetCode)
      : '';
  return `${name}${code}`;
}

export function supplierMatchesDisplay(
  supplier: { supplierName?: string; oldRentnetCode?: number | string | null; pan?: string | null },
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

  const name = (supplier?.supplierName || '').trim().toLowerCase();
  if (name === normalized) {
    return true;
  }

  // Backward compatibility with older Name#OldRentnetCode display values
  const code =
    supplier?.oldRentnetCode !== null &&
    supplier?.oldRentnetCode !== undefined &&
    supplier?.oldRentnetCode !== '' &&
    Number(supplier.oldRentnetCode) !== 0
      ? String(supplier.oldRentnetCode)
      : '';
  if (code && `${name}#${code}` === normalized) {
    return true;
  }

  return false;
}

export function filterSuppliersByDisplay(
  suppliers: Array<{ supplierName?: string; oldRentnetCode?: number | string | null; pan?: string | null }>,
  value: string
): Array<{ supplierName?: string; oldRentnetCode?: number | string | null; pan?: string | null }> {
  const filterValue = (value || '').trim().toLowerCase();
  if (!filterValue) {
    return suppliers || [];
  }

  return (suppliers || []).filter((supplier) => {
    const name = (supplier.supplierName || '').toLowerCase();
    const pan = (supplier.pan || '').toLowerCase();
    const code =
      supplier.oldRentnetCode !== null &&
      supplier.oldRentnetCode !== undefined &&
      supplier.oldRentnetCode !== '' &&
      Number(supplier.oldRentnetCode) !== 0
        ? String(supplier.oldRentnetCode).toLowerCase()
        : '';

    return (
      formatSupplierCode(supplier).toLowerCase().includes(filterValue) ||
      formatSupplierDisplay(supplier).toLowerCase().includes(filterValue) ||
      name.includes(filterValue) ||
      code.includes(filterValue) ||
      pan.includes(filterValue)
    );
  });
}
