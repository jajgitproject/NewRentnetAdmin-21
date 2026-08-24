// @ts-nocheck
export interface DutySlipLobExportCriteria {
  fromPickupDate?: string | null;
  toPickupDate?: string | null;
  maxCandidates?: number;
  exportMaps?: boolean;
  exportRunningDetails?: boolean;
  dryRun?: boolean;
}

export interface DutySlipLobExportCandidatePreview {
  dutySlipID: number;
  column: string;
  contentBytes: number;
  status: string;
}

export interface DutySlipLobExportPreviewResult {
  totalMatchedCount?: number;
  mapCandidateCount?: number;
  runningCandidateCount?: number;
  totalMapBytes?: number;
  totalRunningBytes?: number;
  willProcessCount?: number;
  estimatedBatchCount?: number;
  maxCandidates?: number;
  candidates?: DutySlipLobExportCandidatePreview[];
  TotalMatchedCount?: number;
  MapCandidateCount?: number;
  RunningCandidateCount?: number;
  TotalMapBytes?: number;
  TotalRunningBytes?: number;
  WillProcessCount?: number;
  EstimatedBatchCount?: number;
  Candidates?: DutySlipLobExportCandidatePreview[];
}

export interface StartDutySlipLobExportJobResult {
  jobId: number;
  jobStatus: string;
  totalDutySlips: number;
  JobId?: number;
  JobStatus?: string;
  TotalDutySlips?: number;
}

export interface BulkUploadJobStatus {
  bulkUploadJobID: number;
  jobType: string;
  jobStatus: string;
  totalFiles: number;
  processedFiles: number;
  successCount: number;
  errorCount: number;
  resultFilePath?: string;
  errorMessage?: string;
  BulkUploadJobID?: number;
  JobType?: string;
  JobStatus?: string;
  ProcessedFiles?: number;
  SuccessCount?: number;
  ErrorCount?: number;
}

export interface BulkUploadErrorRow {
  fileName: string;
  errorDescription: string;
  uploadTimestamp?: string;
}
