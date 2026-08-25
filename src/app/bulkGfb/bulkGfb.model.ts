export interface BulkGfbLimits {
  defaultMode: string;
  defaultMaxDuties: number;
  maxDutiesLimit: number;
  batchSize: number;
  allowManual: boolean;
  nightEnabled: boolean;
}

export interface BulkGfbCandidateRow {
  dutySlipID: number;
  dutySlipForBillingID: number;
  reservationID: number;
  pickupDate?: string;
  customerName?: string;
  dsClosing?: string;
  physicalDutySlipReceived?: boolean | null;
  lastItemStatus?: string;
  lastErrorMessage?: string;
  lastBulkGfbRunId?: number | null;
  lastBatchDate?: string;
  lastMode?: string;
  tallyIntegrationCode?: string;
  selected?: boolean;
}

export interface BulkGfbPreviewResult {
  totalMatchedCount: number;
  willProcessCount: number;
  maxDuties: number;
  batchSize: number;
  estimatedBatchCount: number;
  mode: string;
  duties: BulkGfbCandidateRow[];
}

export interface BulkGfbStartResult {
  bulkGfbRunId: number;
  jobStatus: string;
  mode: string;
  maxDuties: number;
  candidateCount: number;
}

export interface BulkGfbRunItem {
  bulkGfbRunItemId: number;
  bulkGfbRunId: number;
  dutySlipID: number;
  reservationID?: number;
  pickupDate?: string;
  customerName?: string;
  itemStatus: string;
  errorMessage?: string;
}

export interface BulkGfbRun {
  bulkGfbRunId: number;
  batchDate: string;
  mode: string;
  triggerSource: string;
  jobStatus: string;
  maxDuties: number;
  scannedCount: number;
  gfbCount: number;
  skippedCount: number;
  failedCount: number;
  createdBy: number;
  errorMessage?: string;
  items: BulkGfbRunItem[];
}
