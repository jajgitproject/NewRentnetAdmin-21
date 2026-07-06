// @ts-nocheck
export interface BulkDownloadSearchCriteria {
  customerID?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
  invoiceNumber?: string | null;
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
  invoiceNumber?: string | null;
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
  invoiceNumber?: string | null;
  invoiceIDs?: number[];
  replaceExisting?: boolean;
  maxCandidates?: number;
}

export interface InvoiceArchiveStatus {
  invoiceID: number;
  isComplete: boolean;
  missingInvoiceDocument: boolean;
  missingDutySlipIDs: number[];
  dutySlipsNeedingTollParking: number[];
  dutySlipsNeedingInterstateTax: number[];
  templateAddress?: string | null;
  invoiceType?: string | null;
}

export interface IrnBackfillPreviewResult {
  totalMatchedCount?: number;
  candidateCount?: number;
  willProcessCount?: number;
  estimatedBatchCount?: number;
  invoices?: BulkDownloadInvoiceSummary[];
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

export type ClosingDutySlipBackfillTargetMode = 'DryRun' | 'Production';

export interface ClosingDutySlipBackfillCriteria {
  minPickUpDate?: string | null;
  maxCandidates?: number;
  skipCount?: number;
  targetMode?: ClosingDutySlipBackfillTargetMode;
  dutySlipIDs?: number[];
}

export interface ClosingDutySlipBackfillCandidateRow {
  dutySlipID: number;
  reservationID?: number | null;
  dutySlipImage?: string | null;
  pickUpDate?: string | null;
  status?: string | null;
  targetRelativePath?: string | null;
  hasActiveTargetDocument?: boolean;
  destinationFileExists?: boolean;
  sourceFileExists?: boolean;
  sourceFileType?: string | null;
}

export interface ClosingDutySlipBackfillPreviewResult {
  targetMode?: string | null;
  targetPathPrefix?: string | null;
  totalMatchedCount?: number;
  candidateCount?: number;
  newDocumentCount?: number;
  toReplaceCount?: number;
  missingSourceFileCount?: number;
  missingReservationCount?: number;
  existingDestinationFileCount?: number;
  unsupportedFileTypeCount?: number;
  willProcessCount?: number;
  estimatedBatchCount?: number;
  candidates?: ClosingDutySlipBackfillCandidateRow[];
}

export interface StartClosingDutySlipBackfillJobResult {
  jobId: number;
  jobStatus: string;
  targetMode?: string | null;
  totalDutySlips: number;
}

export type ClosingDutySlipBackfillProgressStatus = 'Pending' | 'Processing' | 'Success' | 'Skipped' | 'Failed';

export interface ClosingDutySlipBackfillProgressRow {
  dutySlipID: number;
  originalFile: string;
  status: ClosingDutySlipBackfillProgressStatus;
  processingType: string;
  details: string;
  completedAt: string | null;
}

export interface ClosingDutySlipBackfillCompletionSummary {
  totalRecords: number;
  sourcePdfs: number;
  sourceImages: number;
  pdfsCopied: number;
  imagesConverted: number;
  successful: number;
  failed: number;
  skipped: number;
  missingSourceFiles: number;
  unsupportedFileTypes: number;
  databaseInserts: number;
  totalProcessingTimeMs: number;
}

export type DocumentExistsFilter = 'All' | 'Exists' | 'NotExists';

export interface DutySlipDocumentBackfillCriteria {
  customerID?: number;
  fromDate?: string | null;
  toDate?: string | null;
  maxCandidates?: number;
  skipCount?: number;
  targetMode?: ClosingDutySlipBackfillTargetMode;
  dutySlipIDs?: number[];
  documentExistsFilter?: DocumentExistsFilter | string;
}

export interface DutySlipDocumentBackfillCandidateRow {
  dutySlipID: number;
  reservationID?: number | null;
  customerName?: string | null;
  pickUpDate?: string | null;
  status?: string | null;
  targetRelativePath?: string | null;
  hasActiveTargetDocument?: boolean;
  tollParkingReceiptCount?: number;
  interstateReceiptCount?: number;
  hasAllTollInterstateDocuments?: boolean;
}

export interface DutySlipDocumentBackfillPreviewResult {
  targetMode?: string | null;
  targetPathPrefix?: string | null;
  totalMatchedCount?: number;
  candidateCount?: number;
  newDocumentCount?: number;
  toReplaceCount?: number;
  willProcessCount?: number;
  estimatedBatchCount?: number;
  candidates?: DutySlipDocumentBackfillCandidateRow[];
}

export interface StartDutySlipDocumentBackfillJobResult {
  jobId: number;
  jobStatus: string;
  targetMode?: string | null;
  totalDutySlips: number;
}

export interface DutySlipPackageDownloadCriteria {
  customerID: number;
  fromDate?: string | null;
  toDate?: string | null;
  dutySlipIDs?: number[];
  maxCandidates?: number;
  skipCount?: number;
  accumulatorZipRelativePath?: string | null;
}

export interface DutySlipPackageDownloadRow {
  dutySlipID: number;
  reservationID?: number | null;
  customerName?: string | null;
  pickUpDate?: string | null;
  tollReceiptCount?: number;
  interstateReceiptCount?: number;
  slipSource?: string | null;
}

export interface DutySlipPackageDownloadPreviewResult {
  totalMatchedCount?: number;
  candidateCount?: number;
  willProcessCount?: number;
  estimatedBatchCount?: number;
  candidates?: DutySlipPackageDownloadRow[];
}

export interface StartDutySlipPackageDownloadJobResult {
  jobId: number;
  jobStatus: string;
  totalDutySlips: number;
}
