// @ts-nocheck
export class ForcedCreditNoteRebilling {
  invoiceCreditNoteID: number;
  invoiceID: number;
  customerID: number;
  customerName: string;
  creditNoteNumber: string;
  creditNoteNumberWithPrefix: string;
  creditNoteAmount: number;
  creditNoteDate: Date;
  invoiceNumberWithPrefix: string;
  invoiceNumber: string;
  invoiceTotalAmountAfterGST: number;
  requiresReBilling: boolean;

  constructor(forcedCreditNoteRebilling) {
    this.invoiceCreditNoteID = forcedCreditNoteRebilling.invoiceCreditNoteID || -1;
    this.invoiceID = forcedCreditNoteRebilling.invoiceID || 0;
    this.customerID = forcedCreditNoteRebilling.customerID || 0;
    this.customerName = forcedCreditNoteRebilling.customerName || '';
    this.creditNoteNumber = forcedCreditNoteRebilling.creditNoteNumber || '';
    this.creditNoteNumberWithPrefix = forcedCreditNoteRebilling.creditNoteNumberWithPrefix || '';
    this.creditNoteAmount = forcedCreditNoteRebilling.creditNoteAmount || 0;
    this.creditNoteDate =
      forcedCreditNoteRebilling.creditNoteDate ||
      forcedCreditNoteRebilling.dateTimeOfGeneration ||
      forcedCreditNoteRebilling.creditNoteDateString ||
      null;
    this.invoiceNumberWithPrefix = forcedCreditNoteRebilling.invoiceNumberWithPrefix || '';
    this.invoiceNumber = forcedCreditNoteRebilling.invoiceNumber || '';
    this.invoiceTotalAmountAfterGST = forcedCreditNoteRebilling.invoiceTotalAmountAfterGST || 0;
    this.requiresReBilling = forcedCreditNoteRebilling.requiresReBilling || false;
  }
}
