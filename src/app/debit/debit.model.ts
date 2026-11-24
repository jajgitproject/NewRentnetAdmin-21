// @ts-nocheck
export class DebitModel {
  debitID: number;
  dutySlipID: number | null;
  reservationID: number | null;
  incidenceID: number | null;
  driverID: number | null;
  supplierID: number | null;
  inventoryID: number | null;
  date: Date | string | null;
  dateString: string;
  locationID: number;
  debitTypeID: number;
  amount: number;
  narration: string;
  debitFrom: string;
  debitCreatedByID: number;
  activationStatus: boolean;
  userID: number;

  driverName: string;
  driverDisplay: string;
  supplierName: string;
  registrationNumber: string;
  locationName: string;
  debitType: string;
  debitTypeFor: string;
  readOnlyOnDebitScreen: boolean;

  constructor(item?: any) {
    this.debitID = item?.debitID ?? item?.DebitID ?? -1;
    this.dutySlipID = item?.dutySlipID ?? item?.DutySlipID ?? null;
    this.reservationID = item?.reservationID ?? item?.ReservationID ?? null;
    this.incidenceID = item?.incidenceID ?? item?.IncidenceID ?? null;
    this.driverID = item?.driverID ?? item?.DriverID ?? null;
    this.supplierID = item?.supplierID ?? item?.SupplierID ?? null;
    this.inventoryID = item?.inventoryID ?? item?.InventoryID ?? null;
    this.date = item?.date ?? item?.Date ?? null;
    this.dateString = item?.dateString ?? item?.DateString ?? '';
    this.locationID = item?.locationID ?? item?.LocationID ?? 0;
    this.debitTypeID = item?.debitTypeID ?? item?.DebitTypeID ?? 0;
    this.amount = item?.amount ?? item?.Amount ?? 0;
    this.narration = item?.narration ?? item?.Narration ?? '';
    this.debitFrom = item?.debitFrom ?? item?.DebitFrom ?? 'Debit Screen';
    this.debitCreatedByID = item?.debitCreatedByID ?? item?.DebitCreatedByID ?? 0;
    this.userID = item?.userID ?? item?.UserID ?? 0;
    this.driverName = item?.driverName ?? item?.DriverName ?? '';
    this.driverDisplay = item?.driverDisplay ?? item?.DriverDisplay ?? '';
    this.supplierName = item?.supplierName ?? item?.SupplierName ?? '';
    this.registrationNumber = item?.registrationNumber ?? item?.RegistrationNumber ?? '';
    this.locationName = item?.locationName ?? item?.LocationName ?? '';
    this.debitType = item?.debitType ?? item?.DebitType ?? '';
    this.debitTypeFor = item?.debitTypeFor ?? item?.DebitTypeFor ?? '';
    this.readOnlyOnDebitScreen =
      item?.readOnlyOnDebitScreen ??
      item?.ReadOnlyOnDebitScreen ??
      (this.debitTypeFor === 'Incidence');
    this.activationStatus = this.parseActivationStatus(item);
  }

  private parseActivationStatus(item: any): boolean {
    const raw = item?.activationStatus ?? item?.ActivationStatus;
    if (raw === false || raw === 0 || raw === '0' || raw === 'false') {
      return false;
    }
    return true;
  }
}