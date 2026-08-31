export interface BulkCreditNoteLimits {
  defaultMaxInvoices: number;
  maxInvoicesLimit: number;
  batchSize: number;
  allowManual: boolean;
}

export interface BulkCreditNoteCandidateRow {
  invoiceID: number;
  invoiceNumberWithPrefix?: string;
  invoiceDate?: string;
  customerID?: number;
  customerName?: string;
  tallyIntegrationCode?: string;
  branchID?: number;
  branchName?: string;
  invoiceTotalAmountAfterGST?: number;
  pendingAmount?: number;
  irn?: string;
}

export interface BulkCreditNotePreviewResult {
  totalMatchedCount: number;
  willProcessCount: number;
  maxInvoices: number;
  batchSize: number;
  estimatedBatchCount: number;
  invoices: BulkCreditNoteCandidateRow[];
}

export interface BulkCreditNoteStartResult {
  bulkCreditNoteRunId: number;
  jobStatus: string;
  maxInvoices: number;
  candidateCount: number;
}

export interface BulkCreditNoteRunItem {
  bulkCreditNoteRunItemId: number;
  bulkCreditNoteRunId: number;
  invoiceID: number;
  invoiceNumberWithPrefix?: string;
  customerName?: string;
  invoiceCreditNoteID?: number;
  creditNoteNumber?: string;
  itemStatus: string;
  errorMessage?: string;
}

export interface BulkCreditNoteRun {
  bulkCreditNoteRunId: number;
  batchDate: string;
  mode: string;
  triggerSource: string;
  jobStatus: string;
  maxInvoices: number;
  reason?: string;
  scannedCount: number;
  createdCount: number;
  skippedCount: number;
  failedCount: number;
  createdBy: number;
  errorMessage?: string;
  items: BulkCreditNoteRunItem[];
}
