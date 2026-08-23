export interface BulkInvoiceLimits {
  defaultMode: string;
  defaultMaxDuties: number;
  maxDutiesLimit: number;
  batchSize: number;
  allowManual: boolean;
  nightEnabled: boolean;
  markPreviewLimit: number;
}

export interface BulkInvoiceCandidateRow {
  dutySlipID: number;
  dutySlipForBillingID: number;
  reservationID: number;
  pickupDate?: string;
  customerName?: string;
  tallyIntegrationCode?: string;
  invoicePrefix?: string;
  lastItemStatus?: string;
  lastErrorMessage?: string;
  lastBulkInvoiceRunId?: number | null;
  lastBatchDate?: string;
  lastMode?: string;
}

export interface BulkInvoicePreviewResult {
  totalMatchedCount: number;
  willProcessCount: number;
  maxDuties: number;
  batchSize: number;
  estimatedBatchCount: number;
  mode: string;
  duties: BulkInvoiceCandidateRow[];
}

export interface BulkInvoiceStartResult {
  bulkInvoiceRunId: number;
  jobStatus: string;
  mode: string;
  maxDuties: number;
  candidateCount: number;
}

export interface BulkInvoiceRunItem {
  bulkInvoiceRunItemId: number;
  bulkInvoiceRunId: number;
  dutySlipID: number;
  reservationID?: number;
  pickupDate?: string;
  customerName?: string;
  invoicePrefix?: string;
  invoiceNumberWithPrefix?: string;
  itemStatus: string;
  errorMessage?: string;
}

export interface BulkInvoiceRun {
  bulkInvoiceRunId: number;
  batchDate: string;
  mode: string;
  triggerSource: string;
  jobStatus: string;
  maxDuties: number;
  scannedCount: number;
  createdCount: number;
  alreadyInvoicedCount: number;
  skippedCount: number;
  failedCount: number;
  createdBy: number;
  errorMessage?: string;
  items: BulkInvoiceRunItem[];
}

export interface MarkReadyForBulkBillingRow {
  dutySlipID: number;
  dutySlipForBillingID: number;
  reservationID: number;
  pickupDate?: string;
  customerName?: string;
  tallyIntegrationCode?: string;
  bulkGfbBatchId?: number | null;
  bulkGfbBatchDate?: string;
  readyForBulkBilling: boolean;
}

export interface MarkReadyForBulkBillingPreviewResult {
  totalMatchedCount: number;
  duties: MarkReadyForBulkBillingRow[];
}
