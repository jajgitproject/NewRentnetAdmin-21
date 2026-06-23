export interface InvoiceExportRow {
  invoiceID: number;
  invoicePrefix: string;
  invoiceNumber: number;
  invoiceNumberWithPrefix: string;
  invoiceDate?: string | Date;
}
