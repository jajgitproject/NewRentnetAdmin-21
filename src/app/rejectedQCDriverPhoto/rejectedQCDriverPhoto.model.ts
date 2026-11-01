export interface RejectedQCDriverPhotoSearchCriteria {
  qcDateFrom: string;
  qcDateTo: string;
  imageCount: number;
}

export interface RejectedQCDriverPhotoDownloadSummary {
  requestedImageCount?: number;
  includedImageCount?: number;
  availableImageCount?: number;
  skippedMissingCount?: number;
  message?: string;
}
