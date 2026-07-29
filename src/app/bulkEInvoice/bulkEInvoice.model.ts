// @ts-nocheck

export interface BulkEInvoiceSearchCriteria {
  customerID?: number | null;
  customerName?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  invoiceNumber?: string | null;
  invoiceIDs?: number[] | null;
  maxCandidates?: number | null;
}

export interface BulkEInvoiceCandidateRow {
  invoiceID: number;
  invoiceNumberWithPrefix: string;
  invoiceDate: string;
  customerID?: number | null;
  customerName?: string | null;
  invoiceType?: string | null;
  generateIrnInvoiceType?: string | null;
}

export interface BulkEInvoicePreviewResult {
  totalMatchedCount: number;
  candidateCount: number;
  willProcessCount: number;
  maxPerBatch?: number;
  estimatedBatchCount: number;
  throttleMilliseconds: number;
  estimatedDurationSeconds: number;
  invoices: BulkEInvoiceCandidateRow[];
}

export interface BulkEInvoiceLimits {
  defaultMaxCandidates: number;
  maxCandidatesLimit: number;
}

export interface StartBulkEInvoiceJobResult {
  jobId: number;
  jobStatus: string;
  totalInvoices: number;
}

export interface BulkUploadJobStatus {
  bulkUploadJobID?: number;
  jobType?: string;
  jobStatus?: string;
  totalFiles?: number;
  processedFiles?: number;
  successCount?: number;
  errorCount?: number;
  errorMessage?: string;
  startedDate?: string;
  completedDate?: string;
}

export type BulkEInvoiceProgressStatus = 'Pending' | 'Success' | 'Failed' | 'Skipped';

export interface BulkEInvoiceProgressRow {
  invoiceNumber: string;
  status: BulkEInvoiceProgressStatus;
  message?: string;
}
