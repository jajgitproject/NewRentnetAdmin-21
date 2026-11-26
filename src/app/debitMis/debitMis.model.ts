// @ts-nocheck
export class DebitMisRow {
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
    this.dateString = item?.dateString ?? '';
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
    this.createdOn = item?.createdOn ?? item?.CreatedOn ?? '';
    this.debitStatus = item?.debitStatus ?? item?.DebitStatus ?? '';
  }
}