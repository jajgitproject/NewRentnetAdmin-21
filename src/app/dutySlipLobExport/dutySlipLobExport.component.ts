// @ts-nocheck
import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { Subscription, TimeoutError, forkJoin, timer } from 'rxjs';
import { finalize, switchMap, timeout } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import {
  BulkUploadErrorRow,
  BulkUploadJobStatus,
  DutySlipLobExportCandidatePreview,
  DutySlipLobExportCriteria,
  DutySlipLobExportPreviewResult,
} from './dutySlipLobExport.model';
import { DutySlipLobExportService } from './dutySlipLobExport.service';

@Component({
  standalone: false,
  selector: 'app-duty-slip-lob-export',
  templateUrl: './dutySlipLobExport.component.html',
  styleUrls: ['./dutySlipLobExport.component.scss'],
})
export class DutySlipLobExportComponent implements OnDestroy {
  fromPickupDateCtrl = new FormControl(this.getTodayDate());
  toPickupDateCtrl = new FormControl(this.getTodayDate());
  maxCandidatesCtrl = new FormControl(500);
  exportMaps = true;
  exportRunningDetails = true;
  readonly maxPickupDateRangeDays = 31;

  preview: DutySlipLobExportPreviewResult | null = null;
  candidates: DutySlipLobExportCandidatePreview[] = [];
  loadError = '';
  previewLoading = false;
  exporting = false;
  candidateColumns = ['dutySlipID', 'column', 'contentBytes', 'status'];

  activeJob: BulkUploadJobStatus | null = null;
  jobErrors: BulkUploadErrorRow[] = [];

  private pollSub?: Subscription;
  private previewSub?: Subscription;
  private static readonly PreviewTimeoutMs = 120000;

  constructor(
    private service: DutySlipLobExportService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.stopPolling();
    this.previewSub?.unsubscribe();
  }

  private getTodayDate(): Date {
    return moment().utcOffset('+05:30').startOf('day').toDate();
  }

  private formatApiDate(value: any): string | null {
    if (!value) {
      return null;
    }
    const m = moment(value).utcOffset('+05:30');
    return m.isValid() ? m.format('YYYY-MM-DD') : null;
  }

  private validatePickupDates(): string | null {
    const fromVal = this.fromPickupDateCtrl.value;
    const toVal = this.toPickupDateCtrl.value;
    if (!fromVal || !toVal) {
      return 'Select both Pickup Date From and Pickup Date To.';
    }
    const fromDate = moment(fromVal).startOf('day');
    const toDate = moment(toVal).startOf('day');
    if (!fromDate.isValid() || !toDate.isValid()) {
      return 'Pickup dates are invalid.';
    }
    if (toDate.isBefore(fromDate)) {
      return 'Pickup Date To must be on or after Pickup Date From.';
    }
    if (toDate.diff(fromDate, 'days') + 1 > this.maxPickupDateRangeDays) {
      return `Pickup date range cannot exceed ${this.maxPickupDateRangeDays} days.`;
    }
    return null;
  }

  private buildCriteria(): DutySlipLobExportCriteria {
    let maxCandidates = Number(this.maxCandidatesCtrl.value);
    if (!Number.isFinite(maxCandidates) || maxCandidates <= 0) {
      maxCandidates = 500;
    }
    maxCandidates = Math.min(Math.floor(maxCandidates), 2000);

    return {
      fromPickupDate: this.formatApiDate(this.fromPickupDateCtrl.value),
      toPickupDate: this.formatApiDate(this.toPickupDateCtrl.value),
      maxCandidates,
      exportMaps: !!this.exportMaps,
      exportRunningDetails: !!this.exportRunningDetails,
      dryRun: false,
    };
  }

  previewExport(): void {
    const dateError = this.validatePickupDates();
    if (dateError) {
      this.loadError = dateError;
      this.snackBar.open(this.loadError, 'Close', { duration: 8000 });
      return;
    }

    const criteria = this.buildCriteria();
    if (!criteria.exportMaps && !criteria.exportRunningDetails) {
      this.loadError = 'Select at least one of Export maps or Export running details.';
      this.snackBar.open(this.loadError, 'Close', { duration: 5000 });
      return;
    }

    this.loadError = '';
    this.preview = null;
    this.candidates = [];
    this.previewLoading = true;
    this.previewSub?.unsubscribe();

    this.previewSub = this.service
      .previewDutySlipLobExport(criteria)
      .pipe(
        timeout(DutySlipLobExportComponent.PreviewTimeoutMs),
        finalize(() => (this.previewLoading = false))
      )
      .subscribe({
        next: (result) => {
          this.preview = result;
          const raw = result?.candidates ?? result?.Candidates ?? [];
          this.candidates = (raw || []).map((row: any) => ({
            dutySlipID: row.dutySlipID ?? row.DutySlipID,
            column: row.column ?? row.Column,
            contentBytes: row.contentBytes ?? row.ContentBytes ?? 0,
            status: row.status ?? row.Status ?? 'Ready',
          }));
          const matched = result?.totalMatchedCount ?? result?.TotalMatchedCount ?? 0;
          if (matched === 0) {
            this.loadError =
              'No legacy DutySlip LOB rows matched. Export may already be complete for this pickup date range.';
          }
        },
        error: (err) => {
          if (err instanceof TimeoutError || err?.name === 'TimeoutError') {
            this.loadError =
              'Preview timed out. Use a smaller pickup date range and ensure the API can reach SQL Server.';
          } else {
            this.loadError = this.extractError(err, 'Failed to preview DutySlip LOB export.');
          }
          this.snackBar.open(this.loadError, 'Close', { duration: 8000 });
        },
      });
  }

  canStartExport(): boolean {
    const matched = this.preview?.totalMatchedCount ?? this.preview?.TotalMatchedCount ?? 0;
    return !!this.preview && matched > 0 && !this.exporting;
  }

  getMatchedCount(): number {
    return this.preview?.totalMatchedCount ?? this.preview?.TotalMatchedCount ?? 0;
  }

  getMapCount(): number {
    return this.preview?.mapCandidateCount ?? this.preview?.MapCandidateCount ?? 0;
  }

  getRunningCount(): number {
    return this.preview?.runningCandidateCount ?? this.preview?.RunningCandidateCount ?? 0;
  }

  getWillProcessCount(): number {
    return this.preview?.willProcessCount ?? this.preview?.WillProcessCount ?? 0;
  }

  getEstimatedBatches(): number {
    return this.preview?.estimatedBatchCount ?? this.preview?.EstimatedBatchCount ?? 0;
  }

  formatBytes(value: number | null | undefined): string {
    const bytes = Number(value || 0);
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return '0 B';
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  getMapBytesLabel(): string {
    return this.formatBytes(this.preview?.totalMapBytes ?? this.preview?.TotalMapBytes);
  }

  getRunningBytesLabel(): string {
    return this.formatBytes(this.preview?.totalRunningBytes ?? this.preview?.TotalRunningBytes);
  }

  startExport(): void {
    if (!this.canStartExport()) {
      return;
    }

    const dateError = this.validatePickupDates();
    if (dateError) {
      this.snackBar.open(dateError, 'Close', { duration: 5000 });
      return;
    }

    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session is required to start export.', 'Close', { duration: 5000 });
      return;
    }

    const criteria = this.buildCriteria();
    this.loadError = '';
    this.exporting = true;
    this.jobErrors = [];

    this.service.startDutySlipLobExportJob(criteria, performedBy).subscribe({
      next: (result) => {
        const jobId = result?.jobId ?? result?.JobId;
        if (!jobId) {
          this.exporting = false;
          this.snackBar.open('Export job did not start.', 'Close', { duration: 5000 });
          return;
        }
        this.activeJob = this.normalizeJob({
          bulkUploadJobID: jobId,
          jobType: 'DutySlipLobExport',
          jobStatus: result?.jobStatus ?? result?.JobStatus ?? 'Pending',
          totalFiles: result?.totalDutySlips ?? result?.TotalDutySlips ?? 0,
          processedFiles: 0,
          successCount: 0,
          errorCount: 0,
        });
        this.startPolling(jobId);
      },
      error: (err) => {
        this.exporting = false;
        this.loadError = this.extractError(err, 'Failed to start DutySlip LOB export.');
        this.snackBar.open(this.loadError, 'Close', { duration: 8000 });
      },
    });
  }

  isLobExportJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'DutySlipLobExport';
  }

  isStuckJobError(): boolean {
    return !!(this.loadError && /already running|stuck|in-memory lock/i.test(this.loadError));
  }

  clearJob(): void {
    const activeJobId = this.getActiveJobId();
    if (activeJobId && this.isLobExportJob()) {
      this.service.cancelDutySlipLobExportJob(activeJobId).subscribe({ error: () => {} });
    }
    this.stopPolling();
    this.exporting = false;
    this.activeJob = null;
    this.jobErrors = [];
  }

  forceClearStuck(): void {
    this.loadError = '';
    this.service.forceClearStuckDutySlipLobExport().subscribe({
      next: (result) => {
        const cleared = result?.clearedCount ?? result?.ClearedCount ?? 0;
        const message =
          result?.message ??
          result?.Message ??
          (cleared > 0
            ? `Cleared ${cleared} stuck DutySlip LOB export job(s).`
            : 'No stuck DutySlip LOB export jobs were found.');
        this.exporting = false;
        this.activeJob = null;
        this.stopPolling();
        this.snackBar.open(message, 'Close', { duration: 8000 });
      },
      error: (err) => {
        this.loadError = this.extractError(err, 'Failed to clear stuck LOB export job.');
        this.snackBar.open(this.loadError, 'Close', { duration: 8000 });
      },
    });
  }

  getJobStatus(): string {
    return this.activeJob?.jobStatus || this.activeJob?.JobStatus || '';
  }

  getJobProgress(): number {
    if (!this.activeJob?.totalFiles) {
      return 0;
    }
    const processed = this.activeJob.processedFiles ?? this.activeJob.ProcessedFiles ?? 0;
    return Math.min(100, Math.round((processed / this.activeJob.totalFiles) * 100));
  }

  getActiveJobId(): number | null {
    return this.activeJob?.bulkUploadJobID ?? this.activeJob?.BulkUploadJobID ?? null;
  }

  private startPolling(jobId: number): void {
    this.stopPolling();
    this.pollSub = timer(0, 2000)
      .pipe(
        switchMap(() =>
          forkJoin({
            job: this.service.getJob(jobId),
            errors: this.service.getJobErrors(jobId),
          })
        )
      )
      .subscribe({
        next: ({ job, errors }) => {
          this.activeJob = this.normalizeJob(job);
          this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
          const status = this.getJobStatus();
          if (status === 'Completed' || status === 'Partial' || status === 'Failed') {
            this.stopPolling();
            this.exporting = false;
            this.loadJobErrors(jobId);
            const success = this.activeJob?.successCount ?? this.activeJob?.SuccessCount ?? 0;
            const failed = this.activeJob?.errorCount ?? this.activeJob?.ErrorCount ?? 0;
            this.snackBar.open(
              `DutySlip LOB export finished (${status}). Success=${success}, Failed=${failed}. Re-preview to continue remaining rows.`,
              'Close',
              { duration: 10000 }
            );
          }
        },
        error: () => this.stopPolling(),
      });
  }

  private loadJobErrors(jobId: number): void {
    this.service.getJobErrors(jobId).subscribe({
      next: (errors) => {
        this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
      },
      error: () => {
        this.jobErrors = [];
      },
    });
  }

  private stopPolling(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = undefined;
    }
  }

  private normalizeJob(job: any): BulkUploadJobStatus {
    return {
      bulkUploadJobID: job.bulkUploadJobID ?? job.BulkUploadJobID,
      jobType: job.jobType ?? job.JobType,
      jobStatus: job.jobStatus ?? job.JobStatus,
      totalFiles: job.totalFiles ?? job.TotalFiles ?? 0,
      processedFiles: job.processedFiles ?? job.ProcessedFiles ?? 0,
      successCount: job.successCount ?? job.SuccessCount ?? 0,
      errorCount: job.errorCount ?? job.ErrorCount ?? 0,
      resultFilePath: job.resultFilePath ?? job.ResultFilePath,
      errorMessage: job.errorMessage ?? job.ErrorMessage,
    };
  }

  private normalizeErrorRow(row: any): BulkUploadErrorRow {
    return {
      fileName: row.fileName ?? row.FileName ?? '',
      errorDescription: row.errorDescription ?? row.ErrorDescription ?? '',
      uploadTimestamp: row.uploadTimestamp ?? row.UploadTimestamp ?? '',
    };
  }

  private extractError(err: any, fallback: string): string {
    if (typeof err === 'string' && err.trim()) {
      if (err.trim() === 'Unknown Error') {
        return 'Cannot reach the API. Ensure the API is running and environment BaseURL is correct.';
      }
      return err;
    }

    const status = err?.status;
    if (status === 404) {
      return 'Document Management API is not available on this server.';
    }
    if (status === 401 || status === 403) {
      return 'Session expired or not authorized. Please sign in again.';
    }
    if (status === 0) {
      return 'Cannot reach the API. Check network, VPN, or API URL in environment settings.';
    }

    const body = err?.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      const message = body.message ?? body.Message ?? body.title ?? body.Title;
      if (message) {
        return String(message);
      }
    }

    return err?.message || fallback;
  }
}
