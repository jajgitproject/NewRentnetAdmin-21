// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BackfillStepDialogComponent } from './backfill-step-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subscription, timer, forkJoin, of, firstValueFrom } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { BulkBillsDownloadService } from './bulkBillsDownload.service';
import {
  BulkDownloadInvoiceSummary,
  BulkDownloadSearchCriteria,
  BulkUploadJobStatus,
  StartBulkDownloadJobRequest,
  IrnBackfillSearchCriteria,
  IrnBackfillProgressRow,
  IrnBackfillProgressStatus,
  InvoiceArchiveStatus,
} from './bulkBillsDownload.model';

@Component({
  standalone: false,
  selector: 'app-bulk-bills-download',
  templateUrl: './bulkBillsDownload.component.html',
  styleUrls: ['./bulkBillsDownload.component.sass'],
})
export class BulkBillsDownloadComponent implements OnInit, OnDestroy {
  @ViewChild('uploadFileInput') uploadFileInput?: ElementRef<HTMLInputElement>;

  activeTab: 'backfill' | 'download' | 'upload' = 'download';
  loading = false;
  loadError = '';
  downloading = false;
  uploading = false;
  backfilling = false;
  backfillCandidateCount: number | null = null;

  fromDateCtrl = new FormControl(moment().utcOffset('+05:30').subtract(30, 'days').toDate());
  toDateCtrl = new FormControl(moment().utcOffset('+05:30').toDate());
  customerCtrl = new FormControl('');
  downloadInvoices = false;
  downloadDutySlips = false;
  downloadMerge = true;
  uploadType: 'reservationEmail' | 'dutySlip' = 'reservationEmail';
  uploadMode: 'bulk' | 'single' = 'bulk';

  customerList: { customerID: number; customerName: string }[] = [];
  filteredCustomerOptions: Observable<{ customerID: number; customerName: string }[]>;

  invoiceRows: BulkDownloadInvoiceSummary[] = [];
  selection = new SelectionModel<BulkDownloadInvoiceSummary>(true, []);
  displayedColumns = [
    'select',
    'invoiceNumberWithPrefix',
    'invoiceDate',
    'reservationID',
    'customerName',
  ];

  activeJob: BulkUploadJobStatus | null = null;
  jobErrors: any[] = [];
  backfillProgressRows: IrnBackfillProgressRow[] = [];
  backfillProgressColumns = [
    'invoiceNumberWithPrefix',
    'customerName',
    'status',
    'details',
    'completedAt',
  ];
  private pollIsIrnBackfill = false;
  private backfillCandidateRows: BulkDownloadInvoiceSummary[] = [];
  private pollSub?: Subscription;
  private backfillCancelled = false;
  private activeBackfillJobId: number | null = null;
  private selectedFiles: File[] = [];
  selectedFileLabel = '';
  private shownNamingSkipModals = new Set<string>();

  constructor(
    private service: BulkBillsDownloadService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initCustomerAutocomplete();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  setTab(tab: 'backfill' | 'download' | 'upload'): void {
    this.activeTab = tab;
  }

  setDownloadOption(option: 'invoices' | 'dutySlips' | 'merge'): void {
    this.downloadInvoices = option === 'invoices';
    this.downloadDutySlips = option === 'dutySlips';
    this.downloadMerge = option === 'merge';
  }

  onDownloadOptionChange(option: 'invoices' | 'dutySlips' | 'merge', checked: boolean): void {
    if (checked) {
      this.setDownloadOption(option);
      return;
    }
    // Keep one option selected (mutually exclusive download modes).
    if (!this.downloadInvoices && !this.downloadDutySlips && !this.downloadMerge) {
      this.setDownloadOption(option);
    }
  }

  getSelectedDownloadMode(): string {
    if (this.downloadInvoices) return 'InvoicesOnly';
    if (this.downloadDutySlips) return 'DutySlipsOnly';
    if (this.downloadMerge) return 'Merge';
    return '';
  }

  search(): void {
    const criteria = this.buildSearchCriteria();
    if (!criteria.customerID && (!criteria.fromDate || !criteria.toDate)) {
      this.loadError = 'Select a customer or provide a date range.';
      this.snackBar.open(this.loadError, 'Close', { duration: 4000 });
      return;
    }

    this.loading = true;
    this.loadError = '';
    this.selection.clear();

    this.service.searchInvoices(criteria).subscribe(
      (rows) => {
        this.invoiceRows = (rows || []).map((row) => this.normalizeInvoiceRow(row));
        this.loading = false;
        if (!this.invoiceRows.length) {
          this.loadError = 'No archived invoice PDFs found in InvoiceDocument for the selected customer and date range.';
        }
      },
      (err) => {
        this.loading = false;
        this.invoiceRows = [];
        this.loadError = this.extractError(err, 'Failed to search invoices.');
        this.snackBar.open(this.loadError, 'Close', { duration: 5000 });
      }
    );
  }

  refresh(): void {
    this.fromDateCtrl.setValue(moment().utcOffset('+05:30').subtract(30, 'days').toDate());
    this.toDateCtrl.setValue(moment().utcOffset('+05:30').toDate());
    this.customerCtrl.setValue('');
    this.setDownloadOption('merge');
    this.backfillCandidateCount = null;
    this.backfillProgressRows = [];
    this.backfillCandidateRows = [];
    this.invoiceRows = [];
    this.selection.clear();
    this.loadError = '';
    this.clearJob();
  }

  isAllSelected(): boolean {
    return this.selection.selected.length === this.invoiceRows.length && this.invoiceRows.length > 0;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.invoiceRows);
  }

  previewBackfillCandidates(): void {
    const criteria = this.buildIrnBackfillCriteria();
    this.backfillCandidateCount = null;
    this.service.previewIrnBackfill(criteria).subscribe(
      (result) => {
        const invoices = result?.invoices ?? result?.Invoices ?? [];
        this.backfillCandidateRows = invoices.map((row) => this.normalizeInvoiceRow(row));
        this.backfillCandidateCount = result?.candidateCount ?? result?.CandidateCount ?? this.backfillCandidateRows.length;
        this.snackBar.open(`${this.backfillCandidateCount} incomplete invoice(s) need IRN PDF backfill.`, 'Close', { duration: 4000 });
      },
      (err) => {
        this.snackBar.open(this.extractError(err, 'Failed to preview backfill candidates.'), 'Close', { duration: 5000 });
      }
    );
  }

  startIrnBackfill(): void {
    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }

    const criteria = this.buildIrnBackfillCriteria();
    this.backfilling = true;
    this.backfillCancelled = false;
    this.activeBackfillJobId = null;
    this.service.previewIrnBackfill(criteria).subscribe(
      async (preview) => {
        const invoices = preview?.invoices ?? preview?.Invoices ?? this.backfillCandidateRows ?? [];
        this.backfillCandidateRows = (invoices || []).map((row) => this.normalizeInvoiceRow(row));
        if (!this.backfillCandidateRows.length) {
          this.backfilling = false;
          this.snackBar.open('No invoices matched the backfill criteria.', 'Close', { duration: 5000 });
          return;
        }
        this.initBackfillProgressRows(this.backfillCandidateRows);
        this.activeJob = {
          bulkUploadJobID: 0,
          jobType: 'IrnBackfill',
          jobStatus: 'Processing',
          totalFiles: this.backfillCandidateRows.length,
          processedFiles: 0,
          successCount: 0,
          errorCount: 0,
        };
        await this.runInteractiveBackfill(this.backfillCandidateRows, performedBy);
      },
      (err) => {
        this.backfilling = false;
        this.snackBar.open(this.extractError(err, 'Failed to load backfill candidates.'), 'Close', { duration: 5000 });
      }
    );
  }

  startDownload(): void {
    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }

    if (!this.invoiceRows.length) {
      this.snackBar.open('Search for invoices before downloading.', 'Close', { duration: 4000 });
      return;
    }

    const downloadMode = this.getSelectedDownloadMode();
    if (!downloadMode) {
      this.snackBar.open('Select a download option.', 'Close', { duration: 4000 });
      return;
    }

    const request: StartBulkDownloadJobRequest = {
      ...this.buildSearchCriteria(),
      downloadMode,
    };

    const selectedIds = this.selection.selected.map((row) => row.invoiceID);
    if (selectedIds.length > 0) {
      request.invoiceIDs = selectedIds;
    }

    this.downloading = true;
    this.service.startDownloadJob(request, performedBy).subscribe(
      (result) => {
        this.downloading = false;
        const jobId = result?.jobId ?? result?.JobId;
        this.snackBar.open(`Download job ${jobId} started.`, 'Close', { duration: 4000 });
        this.startPolling(jobId);
      },
      (err) => {
        this.downloading = false;
        this.snackBar.open(this.extractError(err, 'Failed to start download job.'), 'Close', { duration: 5000 });
      }
    );
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input?.files ? Array.from(input.files) : [];
    if (!this.selectedFiles.length) {
      this.selectedFileLabel = '';
      return;
    }
    if (this.selectedFiles.length === 1) {
      this.selectedFileLabel = this.selectedFiles[0].name;
      return;
    }
    this.selectedFileLabel = `${this.selectedFiles.length} file(s) selected`;
  }

  async uploadFiles(): Promise<void> {
    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }
    if (!this.selectedFiles.length) {
      this.snackBar.open('Select at least one file.', 'Close', { duration: 4000 });
      return;
    }

    const filesToUpload = await this.filterFilesWithNamingConventionCheck(this.selectedFiles);
    if (!filesToUpload.length) {
      this.snackBar.open('No files matched the naming convention.', 'Close', { duration: 5000 });
      return;
    }

    this.uploading = true;
    const finishUpload = (message: string, isError = false) => {
      this.uploading = false;
      this.resetUploadFileSelection();
      this.snackBar.open(message, 'Close', { duration: isError ? 5000 : 4000 });
    };

    const onSuccess = (result: any) => {
      const jobId = result?.jobId ?? result?.JobId;
      if (result?.skipped ?? result?.Skipped) {
        finishUpload(result?.message ?? result?.Message ?? 'Upload skipped — document already exists.');
        return;
      }
      if (jobId) {
        this.uploading = false;
        this.resetUploadFileSelection();
        this.shownNamingSkipModals.clear();
        this.snackBar.open(`Upload job ${jobId} started.`, 'Close', { duration: 4000 });
        this.startPolling(jobId);
        return;
      }
      finishUpload('Upload completed.');
    };
    const onError = async (err: any, fileName?: string) => {
      this.uploading = false;
      const message = this.extractError(err, 'Upload failed.');
      if (fileName && this.isNamingConventionError(message)) {
        await this.showSkippedNamingModal(fileName);
        this.resetUploadFileSelection();
        return;
      }
      finishUpload(message, true);
    };

    if (this.uploadMode === 'single') {
      const file = filesToUpload[0];
      const upload$ = this.uploadType === 'reservationEmail'
        ? this.service.uploadReservationEmailSingle(file, performedBy, 'ReplaceAll')
        : this.service.uploadDutySlipSingle(file, performedBy, 'ReplaceAll');
      upload$.subscribe(onSuccess, (err) => onError(err, file.name));
      return;
    }

    const bulk$ = this.uploadType === 'reservationEmail'
      ? this.service.uploadReservationEmailBulk(filesToUpload, performedBy, 'ReplaceAll')
      : this.service.uploadDutySlipBulk(filesToUpload, performedBy, 'ReplaceAll');
    bulk$.subscribe(onSuccess, onError);
  }

  downloadZip(): void {
    const jobId = this.getActiveJobId();
    if (!jobId) return;

    this.service.downloadZip(jobId).subscribe(
      (blob) => this.triggerBlobDownload(blob, `bulk-bills-download-${jobId}.zip`),
      () => this.snackBar.open('ZIP download failed.', 'Close', { duration: 5000 })
    );
  }

  exportErrors(): void {
    const jobId = this.getActiveJobId();
    if (!jobId) return;

    this.service.exportErrorsCsv(jobId).subscribe(
      (blob) => this.triggerBlobDownload(blob, `bulk-job-errors-${jobId}.csv`),
      () => this.snackBar.open('Error export failed.', 'Close', { duration: 5000 })
    );
  }

  canDownloadZip(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    if (jobType === 'IrnBackfill') return false;

    const status = this.getJobStatus();
    return status === 'Completed' || status === 'Partial';
  }

  isIrnBackfillJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'IrnBackfill';
  }

  getJobStatus(): string {
    return this.activeJob?.jobStatus || this.activeJob?.JobStatus || '';
  }

  getJobProgress(): number {
    if (!this.activeJob?.totalFiles) return 0;
    const processed = this.activeJob.processedFiles ?? this.activeJob.ProcessedFiles ?? 0;
    return Math.min(100, Math.round((processed / this.activeJob.totalFiles) * 100));
  }

  getBackfillProgressSummary(): string {
    const total = this.backfillProgressRows.length || this.activeJob?.totalFiles || 0;
    if (!total) return '';
    const done = this.backfillProgressRows.filter((row) =>
      row.status === 'Success' || row.status === 'Partial' || row.status === 'Failed'
    ).length;
    const processing = this.backfillProgressRows.some((row) => row.status === 'Processing') ? 1 : 0;
    return `${done} completed${processing ? ', 1 in progress' : ''} of ${total}`;
  }

  getProgressStatusClass(status: IrnBackfillProgressStatus): string {
    switch (status) {
      case 'Success':
        return 'progress-status-success';
      case 'Partial':
        return 'progress-status-partial';
      case 'Failed':
        return 'progress-status-failed';
      case 'Processing':
        return 'progress-status-processing';
      default:
        return 'progress-status-pending';
    }
  }

  clearJob(): void {
    this.shownNamingSkipModals.clear();
    this.backfillCancelled = true;
    if (this.activeBackfillJobId) {
      this.service.cancelIrnBackfillJob(this.activeBackfillJobId).subscribe({
        error: () => { /* interactive backfill may not have a server job */ },
      });
    }
    this.stopPolling();
    this.backfilling = false;
    this.activeJob = null;
    this.jobErrors = [];
    this.backfillProgressRows = [];
    this.pollIsIrnBackfill = false;
    this.activeBackfillJobId = null;
  }

  isBackfillRunning(): boolean {
    return this.backfilling || this.getJobStatus() === 'Processing';
  }

  displayCustomer(option: { customerName?: string } | string): string {
    if (!option) return '';
    return typeof option === 'string' ? option : (option.customerName || '');
  }

  private startPolling(jobId: number, isIrnBackfill = false): void {
    this.stopPolling();
    this.pollIsIrnBackfill = isIrnBackfill;
    this.pollSub = timer(0, 2000)
      .pipe(
        switchMap(() =>
          isIrnBackfill
            ? forkJoin({
                job: this.service.getJob(jobId),
                errors: this.service.getJobErrors(jobId),
              })
            : forkJoin({
                job: this.service.getJob(jobId),
                errors: this.service.getJobErrors(jobId),
              })
        )
      )
      .subscribe(
        async ({ job, errors }) => {
          this.activeJob = this.normalizeJob(job);
          if (isIrnBackfill) {
            this.mergeBackfillProgress(errors || []);
            this.jobErrors = (errors || [])
              .map((row) => this.normalizeErrorRow(row))
              .filter((row) => this.parseBackfillLogStatus(row.errorDescription) !== 'Success');
          } else {
            this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
            await this.showNewNamingSkipModals(this.jobErrors);
          }
          const status = this.getJobStatus();
          if (status === 'Completed' || status === 'Partial' || status === 'Failed') {
            this.stopPolling();
            if (isIrnBackfill) {
              this.mergeBackfillProgress(errors || []);
            } else {
              this.loadJobErrors(jobId);
            }
          }
        },
        () => this.stopPolling()
      );
  }

  private initBackfillProgressRows(invoices: BulkDownloadInvoiceSummary[]): void {
    this.backfillProgressRows = (invoices || []).map((invoice) => ({
      invoiceID: invoice.invoiceID,
      invoiceNumberWithPrefix: invoice.invoiceNumberWithPrefix,
      customerName: invoice.customerName,
      status: 'Pending' as IrnBackfillProgressStatus,
      details: '',
      completedAt: null,
    }));
  }

  private mergeBackfillProgress(errorRows: any[]): void {
    if (!this.backfillProgressRows.length) return;

    // IRN backfill processes invoices in grid order and writes one log row per invoice in sequence.
    const sortedLogs = (errorRows || [])
      .map((row) => this.normalizeErrorRow(row))
      .sort((a, b) => {
        const ta = a.uploadTimestamp ? new Date(a.uploadTimestamp).getTime() : 0;
        const tb = b.uploadTimestamp ? new Date(b.uploadTimestamp).getTime() : 0;
        return ta - tb;
      });

    const jobStatus = this.getJobStatus();
    const processed = this.activeJob?.processedFiles ?? this.activeJob?.ProcessedFiles ?? 0;
    const isRunning = jobStatus === 'Processing' || jobStatus === 'Pending';

    this.backfillProgressRows = this.backfillProgressRows.map((row, index) => {
      const log = sortedLogs[index];
      if (log) {
        const status = this.parseBackfillLogStatus(log.errorDescription);
        return {
          ...row,
          status,
          details: this.parseBackfillLogDetails(log.errorDescription),
          completedAt: log.uploadTimestamp || row.completedAt,
        };
      }

      if (isRunning && index === processed) {
        return { ...row, status: 'Processing', details: 'Archiving PDFs…' };
      }

      if (index < processed) {
        return { ...row, status: 'Success', details: 'Archived (no per-invoice log row — restart API for detailed status).' };
      }

      return { ...row, status: 'Pending', details: '' };
    });
  }

  private parseBackfillLogStatus(description: string): IrnBackfillProgressStatus {
    const text = (description || '').trim();
    if (text.startsWith('[OK]')) return 'Success';
    if (text.startsWith('[PARTIAL]')) return 'Partial';
    if (text.startsWith('[FAILED]')) return 'Failed';
    if (text) return 'Failed';
    return 'Pending';
  }

  private parseBackfillLogDetails(description: string): string {
    const text = (description || '').trim();
    if (text.startsWith('[OK]')) return text.substring(5).trim() || 'Archived successfully.';
    if (text.startsWith('[PARTIAL]')) return text.substring(10).trim() || 'Archived with warnings.';
    if (text.startsWith('[FAILED]')) return text.substring(9).trim() || 'Archive failed.';
    return text;
  }

  private loadJobErrors(jobId: number): void {
    this.service.getJobErrors(jobId).subscribe(
      async (errors) => {
        this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
        await this.showNewNamingSkipModals(this.jobErrors);
      },
      () => {
        this.jobErrors = this.activeJob?.errors || [];
      }
    );
  }

  private stopPolling(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = undefined;
    }
  }

  private async runInteractiveBackfill(invoices: BulkDownloadInvoiceSummary[], performedBy: number): Promise<void> {
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let index = 0; index < invoices.length; index++) {
        if (this.backfillCancelled) {
          break;
        }

        const invoice = invoices[index];
        this.setBackfillRowStatus(invoice.invoiceID, 'Processing', 'Archiving PDFs…');
        if (this.activeJob) {
          this.activeJob.processedFiles = index;
        }

        const stepErrors: string[] = [];
        try {
          await this.archiveInvoiceDocumentsInteractive(invoice.invoiceID, performedBy, stepErrors);
          if (this.backfillCancelled) {
            if (!stepErrors.length) {
              this.setBackfillRowStatus(invoice.invoiceID, 'Partial', 'Cancelled — remaining PDFs not archived.');
            }
            break;
          }
          if (stepErrors.length) {
            errorCount++;
            this.setBackfillRowStatus(invoice.invoiceID, 'Partial', stepErrors.join('; '));
          } else {
            successCount++;
            this.setBackfillRowStatus(invoice.invoiceID, 'Success', 'All PDFs archived.');
          }
        } catch (err) {
          errorCount++;
          const message = this.extractError(err, 'Archive failed.');
          stepErrors.push(message);
          this.setBackfillRowStatus(invoice.invoiceID, 'Failed', message);
        }

        if (this.activeJob) {
          this.activeJob.processedFiles = index + 1;
          this.activeJob.successCount = successCount;
          this.activeJob.errorCount = errorCount;
        }
      }
    } finally {
      this.backfilling = false;
      if (this.activeJob) {
        this.activeJob.processedFiles = invoices.length;
        this.activeJob.successCount = successCount;
        this.activeJob.errorCount = errorCount;
        if (this.backfillCancelled) {
          this.activeJob.jobStatus = 'Failed';
          this.activeJob.errorMessage = 'Cancelled by user.';
        } else if (successCount === 0) {
          this.activeJob.jobStatus = 'Failed';
          this.activeJob.errorMessage = 'No invoices were archived.';
        } else if (errorCount > 0) {
          this.activeJob.jobStatus = 'Partial';
        } else {
          this.activeJob.jobStatus = 'Completed';
        }
      }
      if (!this.backfillCancelled) {
        this.snackBar.open('IRN backfill finished.', 'Close', { duration: 4000 });
      }
    }
  }

  private async archiveInvoiceDocumentsInteractive(
    invoiceId: number,
    performedBy: number,
    stepErrors: string[]
  ): Promise<void> {
    const gaps = this.normalizeArchiveStatus(
      await firstValueFrom(this.service.getInvoiceArchiveStatus(invoiceId))
    );

    if (gaps.missingInvoiceDocument) {
      await this.archiveDocumentStep(
        'Invoice',
        () => firstValueFrom(this.service.generateInvoicePdf(invoiceId, performedBy)),
        stepErrors
      );
    } else {
      await this.showStepModal('Invoice', true, 'Already archived');
    }
    if (this.backfillCancelled) return;

    const duties = await firstValueFrom(this.service.getInvoiceDuties(invoiceId));
    const dutyRows = duties || [];
    if (!dutyRows.length) {
      await this.showStepModal('Duty Slip', false, 'NA');
      return;
    }

    for (const duty of dutyRows) {
      if (this.backfillCancelled) return;
      const dutySlipId = duty.dutySlipID ?? duty.DutySlipID;
      if (!dutySlipId) continue;

      if (gaps.missingDutySlipIDs.includes(dutySlipId)) {
        await this.archiveDocumentStep(
          'Duty Slip',
          () => firstValueFrom(this.service.generateDutySlipPdf(dutySlipId, performedBy, invoiceId)),
          stepErrors
        );
      } else {
        await this.showStepModal('Duty Slip', true, 'Already archived');
      }
      if (this.backfillCancelled) return;

      if (gaps.dutySlipsNeedingTollParking.includes(dutySlipId)) {
        await this.archiveReceiptDocumentsStep(
          'Toll Parking',
          () => firstValueFrom(this.service.generateTollParkingPdfs(dutySlipId, performedBy, false)),
          stepErrors
        );
      } else {
        await this.showStepModal('Toll Parking', true, 'Already archived / NA');
      }
      if (this.backfillCancelled) return;

      if (gaps.dutySlipsNeedingInterstateTax.includes(dutySlipId)) {
        await this.archiveReceiptDocumentsStep(
          'Interstate Tax',
          () => firstValueFrom(this.service.generateInterstateTaxPdfs(dutySlipId, performedBy, false)),
          stepErrors
        );
      } else {
        await this.showStepModal('Interstate Tax', true, 'Already archived / NA');
      }
    }
  }

  private async archiveDocumentStep(
    documentType: string,
    action: () => Promise<any>,
    stepErrors: string[]
  ): Promise<void> {
    try {
      const result = await action();
      const fileName = result?.fileName ?? result?.FileName ?? 'NA';
      const created = !!fileName && fileName !== 'NA';
      await this.showStepModal(documentType, created, fileName);
      if (!created) {
        stepErrors.push(`${documentType} not created`);
      }
    } catch (err) {
      const message = this.extractError(err, `${documentType} failed.`);
      stepErrors.push(message);
      await this.showStepModal(documentType, false, 'NA');
    }
  }

  private async archiveReceiptDocumentsStep(
    documentType: string,
    action: () => Promise<any[]>,
    stepErrors: string[]
  ): Promise<void> {
    try {
      const results = await action();
      const docs = results || [];
      if (!docs.length) {
        await this.showStepModal(documentType, false, 'NA');
        return;
      }
      for (const doc of docs) {
        if (this.backfillCancelled) return;
        const fileName = doc?.fileName ?? doc?.FileName ?? 'NA';
        await this.showStepModal(documentType, true, fileName);
      }
    } catch (err) {
      const message = this.extractError(err, `${documentType} failed.`);
      stepErrors.push(message);
      await this.showStepModal(documentType, false, 'NA');
    }
  }

  private showStepModal(documentType: string, created: boolean, fileName: string): Promise<void> {
    const status = created ? 'Created' : 'Not Created';
    const name = created && fileName ? fileName : 'NA';
    const message = `${documentType} ${status} ${name}`;
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(BackfillStepDialogComponent, {
        width: '480px',
        disableClose: true,
        data: { message },
      });
      dialogRef.afterClosed().subscribe(() => resolve());
    });
  }

  private resetUploadFileSelection(): void {
    this.selectedFiles = [];
    this.selectedFileLabel = '';
    const input = this.uploadFileInput?.nativeElement;
    if (input) {
      input.value = '';
    }
  }

  private async filterFilesWithNamingConventionCheck(files: File[]): Promise<File[]> {
    const validFiles: File[] = [];
    for (const file of files) {
      if (this.followsUploadNamingConvention(file.name)) {
        validFiles.push(file);
        continue;
      }
      await this.showSkippedNamingModal(file.name);
    }
    return validFiles;
  }

  private followsUploadNamingConvention(fileName: string): boolean {
    if (!fileName) return false;

    const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : '';
    if (this.uploadType === 'reservationEmail') {
      if (extension !== '.pdf') return false;
    } else if (extension !== '.pdf') {
      return false;
    }

    const stem = fileName.includes('.') ? fileName.slice(0, fileName.lastIndexOf('.')) : fileName;
    return /^\d+$/.test(stem);
  }

  private isNamingConventionError(description: string): boolean {
    const text = (description || '').toLowerCase();
    return text.includes('filename must be numeric only')
      || text.includes('reservationid from filename must exist')
      || text.includes('dutyslipid from filename must exist')
      || text.includes('unsupported file type')
      || text.includes('file name is required')
      || text.includes('naming convention');
  }

  private async showNewNamingSkipModals(errors: any[]): Promise<void> {
    for (const err of errors || []) {
      const fileName = err.fileName ?? err.FileName ?? '';
      const description = err.errorDescription ?? err.ErrorDescription ?? '';
      if (!fileName || !this.isNamingConventionError(description)) continue;
      if (this.shownNamingSkipModals.has(fileName)) continue;
      this.shownNamingSkipModals.add(fileName);
      await this.showSkippedNamingModal(fileName);
    }
  }

  private showSkippedNamingModal(fileName: string): Promise<void> {
    const message = `${fileName} was skipped as it does not follow the Naming Convention`;
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(BackfillStepDialogComponent, {
        width: '480px',
        disableClose: true,
        data: {
          title: 'Upload skipped',
          message,
        },
      });
      dialogRef.afterClosed().subscribe(() => resolve());
    });
  }

  private setBackfillRowStatus(invoiceId: number, status: IrnBackfillProgressStatus, details: string): void {
    const row = this.backfillProgressRows.find((r) => r.invoiceID === invoiceId);
    if (!row) return;
    row.status = status;
    row.details = details;
    if (status === 'Success' || status === 'Partial' || status === 'Failed') {
      row.completedAt = new Date().toISOString();
    }
  }

  private getActiveJobId(): number | null {
    return this.activeJob?.bulkUploadJobID ?? this.activeJob?.BulkUploadJobID ?? null;
  }

  private buildIrnBackfillCriteria(): IrnBackfillSearchCriteria {
    return {};
  }

  private normalizeArchiveStatus(raw: any): InvoiceArchiveStatus {
    const missingDutySlipIDs = raw?.missingDutySlipIDs ?? raw?.MissingDutySlipIDs ?? [];
    const dutySlipsNeedingTollParking = raw?.dutySlipsNeedingTollParking ?? raw?.DutySlipsNeedingTollParking ?? [];
    const dutySlipsNeedingInterstateTax = raw?.dutySlipsNeedingInterstateTax ?? raw?.DutySlipsNeedingInterstateTax ?? [];
    return {
      invoiceID: raw?.invoiceID ?? raw?.InvoiceID ?? 0,
      isComplete: !!(raw?.isComplete ?? raw?.IsComplete),
      missingInvoiceDocument: !!(raw?.missingInvoiceDocument ?? raw?.MissingInvoiceDocument),
      missingDutySlipIDs: Array.isArray(missingDutySlipIDs) ? missingDutySlipIDs : [],
      dutySlipsNeedingTollParking: Array.isArray(dutySlipsNeedingTollParking) ? dutySlipsNeedingTollParking : [],
      dutySlipsNeedingInterstateTax: Array.isArray(dutySlipsNeedingInterstateTax) ? dutySlipsNeedingInterstateTax : [],
    };
  }

  private extractBackfillError(err: any, criteria: IrnBackfillSearchCriteria): string {
    const base = this.extractError(err, 'Failed to start IRN backfill job.');
    if (!base.toLowerCase().includes('no invoices matched')) {
      return base;
    }

    return `${base} No IRN invoices need backfill, or all required archived PDFs are already complete. Run IrnBackfill_Candidates.sql to verify.`;
  }

  private buildSearchCriteria(): BulkDownloadSearchCriteria {
    const customer = this.resolveSelectedCustomer();
    return {
      customerID: customer?.customerID || null,
      fromDate: this.formatApiDate(this.fromDateCtrl.value),
      toDate: this.formatApiDate(this.toDateCtrl.value),
    };
  }

  private resolveSelectedCustomer(): { customerID: number; customerName: string } | null {
    const value = this.customerCtrl.value;
    if (!value) return null;
    if (typeof value === 'object' && value.customerID) return value;
    const name = String(value).trim().toLowerCase();
    return this.customerList.find((c) => c.customerName.toLowerCase() === name) || null;
  }

  private initCustomerAutocomplete(): void {
    this.generalService.getCustomers().subscribe((data) => {
      this.customerList = (data || [])
        .map((c) => ({
          customerID: c.customerID ?? c.CustomerID ?? 0,
          customerName: (c.customerName ?? c.CustomerName ?? '').trim(),
        }))
        .filter((c) => c.customerID && c.customerName);

      this.filteredCustomerOptions = this.customerCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterCustomers(typeof value === 'string' ? value : value?.customerName || ''))
      );
    });
  }

  private filterCustomers(value: string): { customerID: number; customerName: string }[] {
    if (!value || value.length < 2) return [];
    const filterValue = value.toLowerCase();
    return this.customerList.filter((c) => c.customerName.toLowerCase().includes(filterValue));
  }

  private formatApiDate(value: any): string | null {
    if (!value) return null;
    const m = moment(value).utcOffset('+05:30');
    return m.isValid() ? m.format('YYYY-MM-DD') : null;
  }

  private normalizeInvoiceRow(row: any): BulkDownloadInvoiceSummary {
    return {
      invoiceID: row.invoiceID ?? row.InvoiceID,
      invoiceNumberWithPrefix: row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix ?? '',
      invoiceDate: row.invoiceDate ?? row.InvoiceDate ?? '',
      reservationID: row.reservationID ?? row.ReservationID ?? null,
      customerName: row.customerName ?? row.CustomerName ?? '',
    };
  }

  private normalizeJob(job: any): BulkUploadJobStatus {
    return {
      bulkUploadJobID: job.bulkUploadJobID ?? job.BulkUploadJobID,
      jobType: job.jobType ?? job.JobType,
      jobStatus: job.jobStatus ?? job.JobStatus,
      downloadMode: job.downloadMode ?? job.DownloadMode,
      replacePolicy: job.replacePolicy ?? job.ReplacePolicy,
      totalFiles: job.totalFiles ?? job.TotalFiles ?? 0,
      processedFiles: job.processedFiles ?? job.ProcessedFiles ?? 0,
      successCount: job.successCount ?? job.SuccessCount ?? 0,
      errorCount: job.errorCount ?? job.ErrorCount ?? 0,
      resultFilePath: job.resultFilePath ?? job.ResultFilePath,
      errorMessage: job.errorMessage ?? job.ErrorMessage,
      errors: job.errors ?? job.Errors,
    };
  }

  private normalizeErrorRow(row: any): any {
    return {
      fileName: row.fileName ?? row.FileName ?? '',
      errorDescription: row.errorDescription ?? row.ErrorDescription ?? '',
      uploadTimestamp: row.uploadTimestamp ?? row.UploadTimestamp ?? '',
    };
  }

  private triggerBlobDownload(blob: Blob, fileName: string): void {
    const fileUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(fileUrl);
  }

  private extractError(err: any, fallback: string): string {
    if (typeof err === 'string' && err.trim()) {
      return err;
    }

    const status = err?.status;
    if (status === 404) {
      return 'Document Management API is not available on this server. Deploy the latest RentnetAPI build (documentManagement endpoints) or point the app to an API that includes it.';
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
