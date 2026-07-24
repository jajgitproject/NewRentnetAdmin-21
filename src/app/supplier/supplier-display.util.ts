// @ts-nocheck

export function formatSupplierDisplay(supplier: {
  supplierName?: string;
  oldRentnetCode?: number | string | null;
}): string {
  const name = (supplier?.supplierName || '').trim();
  const code = supplier?.oldRentnetCode;
  if (code !== null && code !== undefined && code !== '' && code !== 0) {
    return `${name}#${code}`;
  }
  return name;
}

export function supplierMatchesDisplay(
  supplier: { supplierName?: string; oldRentnetCode?: number | string | null },
  displayValue: string
): boolean {
  return formatSupplierDisplay(supplier).toLowerCase() === (displayValue || '').trim().toLowerCase();
}

export function filterSuppliersByDisplay(
  suppliers: Array<{ supplierName?: string; oldRentnetCode?: number | string | null }>,
  value: string
): Array<{ supplierName?: string; oldRentnetCode?: number | string | null }> {
  const filterValue = (value || '').trim().toLowerCase();
  if (!filterValue) {
    return suppliers || [];
  }

  return (suppliers || []).filter(
    (supplier) =>
      formatSupplierDisplay(supplier).toLowerCase().includes(filterValue) ||
      (supplier.supplierName || '').toLowerCase().includes(filterValue)
  );
}
