// @ts-nocheck
export class DebitMisRow {
  debitDate: string;
  date: Date | string | null;
  dateString: string;
  debitID: number;
  source: string;
  incidenceID: number;
  location: string;
  supplierName: string;
  supplierType: string;
  driverName: string;
  driverMobileNo: string;
  carRegistrationNo: string;
  debitType: string;
  amount: number;
  narration: string;
  createdBy: string;
  createdOn: string;
  debitStatus: string;

  constructor(item: any) {
    const debitDateDisplay = pickDebitDate(item);
    this.debitDate = debitDateDisplay;
    this.date = item?.date ?? item?.Date ?? null;
    this.dateString = debitDateDisplay;
    this.debitID = item?.debitID ?? item?.DebitID ?? 0;
    this.source = item?.source ?? item?.Source ?? '';
    this.incidenceID = item?.incidenceID ?? item?.IncidenceID ?? null;
    this.location = item?.location ?? item?.Location ?? '';
    this.supplierName = item?.supplierName ?? item?.SupplierName ?? '';
    this.supplierType = item?.supplierType ?? item?.SupplierType ?? '';
    this.driverName = item?.driverName ?? item?.DriverName ?? '';
    this.driverMobileNo = item?.driverMobileNo ?? item?.DriverMobileNo ?? '';
    this.carRegistrationNo = item?.carRegistrationNo ?? item?.CarRegistrationNo ?? '';
    this.debitType = item?.debitType ?? item?.DebitType ?? '';
    this.amount = Number(item?.amount ?? item?.Amount ?? 0);
    this.narration = item?.narration ?? item?.Narration ?? '';
    this.createdBy = item?.createdBy ?? item?.CreatedBy ?? '';
    this.createdOn =
      item?.createdOn ??
      item?.CreatedOn ??
      item?.createdOnDateString ??
      item?.CreatedOnDateString ??
      '';
    this.debitStatus = item?.debitStatus ?? item?.DebitStatus ?? '';
  }
}

/** Debit.Date from API — SQL CONVERT(103) as debitDate, plus legacy shapes. */
function pickDebitDate(item: any): string {
  const direct =
    item?.debitDate ??
    item?.DebitDate ??
    item?.dateString ??
    item?.DateString ??
    '';
  if (String(direct).trim()) {
    return String(direct).trim();
  }
  const raw = item?.date ?? item?.Date;
  if (raw == null || raw === '') {
    return '';
  }
  if (typeof raw === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(raw.trim())) {
    return raw.trim();
  }
  if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}/.test(raw.trim())) {
    const p = raw.trim().substring(0, 10).split('-');
    return `${p[2]}/${p[1]}/${p[0]}`;
  }
  const d = raw instanceof Date ? raw : new Date(raw);
  if (isNaN(d.getTime())) {
    return String(raw);
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}