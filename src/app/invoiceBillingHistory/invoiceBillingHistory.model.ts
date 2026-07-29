// @ts-nocheck
export class InvoiceBillingHistory {
  invoiceHistoryID: number;
  invoiceID: number;
  action: string;
  listOfDuties: string;
  actionByID: number;
  actionDate: Date;
  actionTime: string;
  actionBy: string;
  invoiceNumberWithPrefix: string;
  totalCreditNoteAmount: string;

  constructor(invoiceBillingHistory?) {
    if (invoiceBillingHistory) {
      this.invoiceHistoryID = invoiceBillingHistory.invoiceHistoryID;
      this.invoiceID = invoiceBillingHistory.invoiceID;
      this.action = invoiceBillingHistory.action;
      this.listOfDuties = invoiceBillingHistory.listOfDuties;
      this.actionByID = invoiceBillingHistory.actionByID;
      this.actionDate = invoiceBillingHistory.actionDate;
      this.actionTime = invoiceBillingHistory.actionTime;
      this.actionBy = invoiceBillingHistory.actionBy;
      this.invoiceNumberWithPrefix = invoiceBillingHistory.invoiceNumberWithPrefix;
      this.totalCreditNoteAmount = invoiceBillingHistory.totalCreditNoteAmount;
    }
  }
}
