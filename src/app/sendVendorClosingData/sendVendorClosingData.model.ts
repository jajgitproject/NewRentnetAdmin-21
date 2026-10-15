// @ts-nocheck
export class SendVendorClosingDataRow {
  dutySlipID: number;
  reservationID: number;
  pickupDate: string;
  customerID: number;
  customerName: string;
  tallyCustomerID: number;
  vendor: string;
  status: string;
  failure: string;
  hasPayload: boolean;
  canSelect: boolean;

  constructor(row: any) {
    this.dutySlipID = row?.dutySlipID || row?.DutySlipID || 0;
    this.reservationID = row?.reservationID || row?.ReservationID || 0;
    this.pickupDate = row?.pickupDate || row?.PickupDate || '';
    this.customerID = row?.customerID || row?.CustomerID || 0;
    this.customerName = row?.customerName || row?.CustomerName || '';
    this.tallyCustomerID = row?.tallyCustomerID || row?.TallyCustomerID || 0;
    this.vendor = row?.vendor || row?.Vendor || '';
    this.status = row?.status || row?.Status || 'Unprocessed';
    this.failure = row?.failure || row?.Failure || '';
    this.hasPayload = !!(row?.hasPayload || row?.HasPayload);
    this.canSelect = row?.canSelect === true || row?.CanSelect === true;
  }
}
