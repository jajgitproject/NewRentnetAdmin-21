// @ts-nocheck
export class PrintInvoiceSummaryLine {
  invoiceNumberWithPrefix: string;
  invoiceDate: Date;
  primaryPassengerName: string;
  invoiceTotalAmountAfterGST: number;

  constructor(line) {
    this.invoiceNumberWithPrefix = line.invoiceNumberWithPrefix || '';
    this.invoiceDate = line.invoiceDate || null;
    this.primaryPassengerName = line.primaryPassengerName || '';
    this.invoiceTotalAmountAfterGST = line.invoiceTotalAmountAfterGST || 0;
  }
}

export class PrintInvoiceSummary {
  invoiceSummaryID: number;
  letterDate: Date;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerPin: string;
  numberOfInvoices: number;
  totalAmount: number;
  totalAmountInWords: string;
  invoices: PrintInvoiceSummaryLine[];

  constructor(data) {
    this.invoiceSummaryID = data.invoiceSummaryID || 0;
    this.letterDate = data.letterDate || null;
    this.customerName = data.customerName || '';
    this.customerAddress = data.customerAddress || '';
    this.customerCity = data.customerCity || '';
    this.customerState = data.customerState || '';
    this.customerPin = data.customerPin || '';
    this.numberOfInvoices = data.numberOfInvoices || 0;
    this.totalAmount = data.totalAmount || 0;
    this.totalAmountInWords = data.totalAmountInWords || '';
    this.invoices = (data.invoices || []).map((line) => new PrintInvoiceSummaryLine(line));
  }
}
