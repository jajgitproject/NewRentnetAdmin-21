// @ts-nocheck
export class ReBilledInvoiceModel {
  reBilledInvoiceID: number;
  invoiceCreditNoteID: number;
  invoiceID: number;
  reBillDate: Date;
  rebillTime: Date;
  rebillByID: number;
  rebillByName: string;
  rebillReason: string;
  activationStatus: boolean;
  creditNoteNumberWithPrefix: string;
  creditNoteAmount: number;
  invoiceNumberWithPrefix: string;
  customerName: string;
}

export class ReBilledInvoiceDetailsModel {
  reBilledInvoiceDetailsID: number;
  reBilledInvoiceID: number;
  reservationID: number;
  allotmentID: number;
  dutySlipID: number;
  dutySlipForBIllingID: number;
  invoiceCalculationID: number;
  detailJson: string;
}

export class RebillingDataResponseModel {
  master: ReBilledInvoiceModel;
  details: ReBilledInvoiceDetailsModel[];
}
