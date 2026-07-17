// @ts-nocheck
export class InvoiceSummaryInvoiceItem {
  invoiceID: number;
  invoiceNumberWithPrefix: string;
  customerName: string;
  invoiceDate: Date;
  placeOfSupply: string;
  invoiceTotalAmountAfterGST: number;
  modeOfPayment: string;
  checked?: boolean;

  constructor(item) {
    this.invoiceID = item?.invoiceID || 0;
    this.invoiceNumberWithPrefix = item?.invoiceNumberWithPrefix || '';
    this.customerName = item?.customerName || '';
    this.invoiceDate = item?.invoiceDate || null;
    this.placeOfSupply = item?.placeOfSupply || '';
    this.invoiceTotalAmountAfterGST = item?.invoiceTotalAmountAfterGST || 0;
    this.modeOfPayment = item?.modeOfPayment || '';
    this.checked = item?.checked || false;
  }
}
