export interface InvoiceExportRow {
  invoiceID: number;
  invoicePrefix: string;
  invoiceNumber: number;
  invoiceNumberWithPrefix: string;
  invoiceDate?: string | Date;
}

export interface VerifiedGfbNotCalculatedCounts {
  notCalculated: number;
  partialMissingCustomer: number;
  totalNeedingAction: number;
  NotCalculated?: number;
  PartialMissingCustomer?: number;
  TotalNeedingAction?: number;
}

export interface VerifiedGfbNotCalculatedRow {
  dutySlipID: number;
  reservationID: number;
  customerName?: string;
  guestName?: string;
  city?: string;
  pickUpDateForBilling?: string | Date;
  pickUpDate?: string | Date;
  dropOffDate?: string | Date;
  invoiceCalculationID?: number | null;
  invoiceID?: number | null;
  invoiceCustomerID?: number | null;
  calcStatus?: string;
  DutySlipID?: number;
  ReservationID?: number;
  CustomerName?: string;
  GuestName?: string;
  City?: string;
  PickUpDateForBilling?: string | Date;
  CalcStatus?: string;
}

export interface VerifiedGfbNotCalculatedReport {
  counts: VerifiedGfbNotCalculatedCounts;
  items: VerifiedGfbNotCalculatedRow[];
  page: number;
  pageSize: number;
  totalRows: number;
}
