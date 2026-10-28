// @ts-nocheck
export interface AppBillingReceiptSearchFilter {
  reservationID?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
  customerName?: string | null;
  customerCode?: string | null;
  currentPage?: number;
  pageSize?: number;
}

export interface AppBillingReceiptRow {
  appBillingReceiptID: number;
  dutySlipID: number;
  reservationID: number;
  customerID: number;
  customerName?: string;
  customerCode?: string;
  totalAmount: number;
  advance: number;
  totalPayableAfterAdvance: number;
  tollParkingAmount: number;
  interstateTax: number;
  qrCodeBase64String?: string;
  tripDate?: string | Date;
  invoiceCalculationID?: number;
  createdOn?: string | Date;
  activationStatus?: boolean;
}
