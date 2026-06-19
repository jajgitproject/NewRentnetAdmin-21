// @ts-nocheck
export interface BulkDownloadSearchCriteria {
  customerID?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
  invoiceIDs?: number[];
}

export interface BulkDownloadInvoiceSummary {
  invoiceID: number;
  invoiceNumberWithPrefix: string;
  invoiceDate: string;
  reservationID?: number | null;
  customerName: string;
  hasInvoiceDocument?: boolean;
  dutySlipDocumentCount?: number;
  tollParkingDocumentCount?: number;
  interstateTaxDocumentCount?: number;
  reservationEmailDocumentCount?: number;
}

export interface StartBulkDownloadJobRequest {
  customerID?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
  invoiceIDs?: number[];
  downloadMode: string;
}

export interface BulkUploadJobStatus {
  bulkUploadJobID: number;
  jobType: string;
  jobStatus: string;
  downloadMode?: string;
  replacePolicy?: string;
  totalFiles: number;
  processedFiles: number;
  successCount: number;
  errorCount: number;
  resultFilePath?: string;
  errorMessage?: string;
  errors?: BulkUploadErrorRow[];
}

export interface BulkUploadErrorRow {
  bulkUploadErrorLogID: number;
  bulkUploadJobID: number;
  fileName: string;
  errorDescription: string;
  uploadTimestamp: string;
}

export interface StartBulkDownloadJobResult {
  jobId: number;
  jobStatus: string;
  downloadMode: string;
  totalInvoices: number;
}

export interface StartBulkUploadJobResult {
  jobId: number;
  jobStatus: string;
  totalFiles: number;
}

export interface IrnBackfillSearchCriteria {
  customerID?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
  invoiceIDs?: number[];
  replaceExisting?: boolean;
}

export interface InvoiceArchiveStatus {
  invoiceID: number;
  isComplete: boolean;
  missingInvoiceDocument: boolean;
  missingDutySlipIDs: number[];
  dutySlipsNeedingTollParking: number[];
  dutySlipsNeedingInterstateTax: number[];
}

export interface IrnBackfillPreviewResult {
  candidateCount: number;
  invoices: BulkDownloadInvoiceSummary[];
}

export interface StartIrnBackfillJobResult {
  jobId: number;
  jobStatus: string;
  totalInvoices: number;
}

export type IrnBackfillProgressStatus = 'Pending' | 'Processing' | 'Success' | 'Partial' | 'Failed';

export interface IrnBackfillProgressRow {
  invoiceID: number;
  invoiceNumberWithPrefix: string;
  customerName: string;
  status: IrnBackfillProgressStatus;
  details: string;
  completedAt: string | null;
}

export const DOWNLOAD_MODES = [
  { value: 'InvoicesOnly', label: 'Invoices only' },
  { value: 'DutySlipsOnly', label: 'Duty slips only' },
  { value: 'Merge', label: 'Merge per invoice' },
];

export const REPLACE_POLICIES = [
  { value: 'ReplaceAll', label: 'Replace existing' },
  { value: 'SkipAll', label: 'Skip if exists' },
];
