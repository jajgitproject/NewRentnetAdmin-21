// @ts-nocheck
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subscription, timer, forkJoin, of } from 'rxjs';
import { map, startWith, switchMap, finalize } from 'rxjs/operators';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { BulkBillsDownloadService } from './bulkBillsDownload.service';
import {
  BulkDownloadInvoiceSummary,
  BulkDownloadSearchCriteria,
  BulkUploadJobStatus,
  StartBulkDownloadJobRequest,
  IrnBackfillSearchCriteria,
  IrnBackfillPreviewResult,
  IrnBackfillProgressRow,
  IrnBackfillProgressStatus,
  ClosingDutySlipBackfillCriteria,
  ClosingDutySlipBackfillPreviewResult,
  ClosingDutySlipBackfillCandidateRow,
  ClosingDutySlipBackfillTargetMode,
  ClosingDutySlipBackfillProgressRow,
  ClosingDutySlipBackfillProgressStatus,
  ClosingDutySlipBackfillCompletionSummary,
} from './bulkBillsDownload.model';

@Component({
  standalone: false,
  selector: 'app-bulk-bills-download',
  templateUrl: './bulkBillsDownload.component.html',
  styleUrls: ['./bulkBillsDownload.component.sass'],
})
export class BulkBillsDownloadComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('uploadFileInput') uploadFileInput?: ElementRef<HTMLInputElement>;
  @ViewChild('invoicePaginator') invoicePaginator?: MatPaginator;

  activeTab: 'backfill' | 'download' | 'upload' | 'closingDutySlip' = 'download';
  loading = false;
  loadError = '';
  downloading = false;
  uploading = false;
  backfilling = false;
  irnBatchSize = 1000;
  irnBackfillPreview: IrnBackfillPreviewResult | null = null;
  irnBackfillCandidates: BulkDownloadInvoiceSummary[] = [];
  irnPreviewLoading = false;
  irnRunAllBatches = false;
  irnBatchNumber = 0;
  irnTotalBatches = 0;
  irnAllBatchesProcessed = 0;
  closingBatchSize = 500;

  readonly invoicePageSizeOptions = [10, 25, 50, 100];

  fromDateCtrl = new FormControl(this.getTodayDate());
  toDateCtrl = new FormControl(this.getTodayDate());
  customerCtrl = new FormControl('');
  invoiceNumberCtrl = new FormControl('');
  backfillInvoiceNumberCtrl = new FormControl('');
  backfillLoadError = '';
  closingMinPickUpDateCtrl = new FormControl(new Date(2026, 4, 16));
  closingDutySlipIdsCtrl = new FormControl('');
  closingTargetMode: ClosingDutySlipBackfillTargetMode = 'DryRun';
  closingBackfillPreview: ClosingDutySlipBackfillPreviewResult | null = null;
  closingBackfillCandidates: ClosingDutySlipBackfillCandidateRow[] = [];
  closingBackfillLoadError = '';
  closingBackfilling = false;
  closingPreviewLoading = false;
  closingBackfillProgressRows: ClosingDutySlipBackfillProgressRow[] = [];
  closingBackfillProgressColumns = ['dutySlipID', 'originalFile', 'status', 'processingType', 'details', 'completedAt'];
  closingCompletionSummary: ClosingDutySlipBackfillCompletionSummary | null = null;
  closingJobStartedAt: number | null = null;
  closingRunAllBatches = false;
  closingBatchSkip = 0;
  closingBatchNumber = 0;
  closingTotalBatches = 0;
  closingAllBatchesProcessed = 0;
  downloadInvoices = false;
  downloadDutySlips = false;
  downloadMerge = true;
  uploadType: 'reservationEmail' | 'dutySlip' = 'reservationEmail';
  uploadMode: 'bulk' | 'single' = 'bulk';

  customerList: { customerID: number; customerName: string }[] = [];
  filteredCustomerOptions: Observable<{ customerID: number; customerName: string }[]> = of([]);

  invoiceRows: BulkDownloadInvoiceSummary[] = [];
  invoiceDataSource = new MatTableDataSource<BulkDownloadInvoiceSummary>([]);
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
  private pollIsClosingBackfill = false;
  private pollSub?: Subscription;
  private backfillCancelled = false;
  private selectedFiles: File[] = [];
  selectedFileLabel = '';
  private shownNamingSkipModals = new Set<string>();

  constructor(
    private service: BulkBillsDownloadService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initCustomerAutocomplete();
  }

  ngAfterViewInit(): void {
    if (this.invoicePaginator) {
      this.invoiceDataSource.paginator = this.invoicePaginator;
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  setTab(tab: 'backfill' | 'download' | 'upload' | 'closingDutySlip'): void {
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

  getDownloadButtonLabel(): string {
    const count = this.selection.selected.length;
    return count ? `Download selected (${count})` : 'Download all results';
  }

  search(): void {
    const invoiceNumber = (this.invoiceNumberCtrl.value || '').trim();
    const hasDateRange = !!this.fromDateCtrl.value && !!this.toDateCtrl.value;
    const customer = this.resolveSelectedCustomer();

    if (!invoiceNumber && !hasDateRange && !customer?.customerID) {
      this.loadError = 'Please select customer, invoice number, or date range';
      this.snackBar.open(this.loadError, 'Close', { duration: 4000 });
      return;
    }

    const criteria = this.buildSearchCriteria();
    this.loading = true;
    this.loadError = '';
    this.selection.clear();

    this.service.searchInvoices(criteria).subscribe(
      (rows) => {
        this.invoiceRows = (rows || []).map((row) => this.normalizeInvoiceRow(row));
        this.invoiceDataSource.data = this.invoiceRows;
        if (this.invoicePaginator) {
          this.invoiceDataSource.paginator = this.invoicePaginator;
          this.invoicePaginator.firstPage();
        }
        this.loading = false;
        if (!this.invoiceRows.length) {
          this.loadError = 'No archived invoice PDFs found in InvoiceDocument for the selected criteria.';
        }
      },
      (err) => {
        this.loading = false;
        this.invoiceRows = [];
        this.invoiceDataSource.data = [];
        this.loadError = this.extractError(err, 'Failed to search invoices.');
        this.snackBar.open(this.loadError, 'Close', { duration: 5000 });
      }
    );
  }

  refresh(): void {
    this.fromDateCtrl.setValue(this.getTodayDate());
    this.toDateCtrl.setValue(this.getTodayDate());
    this.customerCtrl.setValue('');
    this.invoiceNumberCtrl.setValue('');
    this.backfillInvoiceNumberCtrl.setValue('');
    this.backfillLoadError = '';
    this.setDownloadOption('merge');
    this.irnBackfillPreview = null;
    this.irnBackfillCandidates = [];
    this.backfillProgressRows = [];
    this.invoiceRows = [];
    this.invoiceDataSource.data = [];
    this.selection.clear();
    this.loadError = '';
    this.clearJob();
  }

  isAllSelected(): boolean {
    const rows = this.invoiceDataSource.data;
    return this.selection.selected.length === rows.length && rows.length > 0;
  }

  masterToggle(): void {
    const rows = this.invoiceDataSource.data;
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...rows);
  }

  isDownloadJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'BulkDownload';
  }

  showDownloadTabJobPanel(): boolean {
    return !!this.activeJob && this.activeTab === 'download' && !this.isIrnBackfillJob() && !this.isClosingDutySlipJob();
  }

  showGlobalJobPanel(): boolean {
    return !!this.activeJob && (this.activeTab === 'backfill' || this.activeTab === 'upload');
  }

  previewIrnBackfill(): void {
    const criteria = this.buildIrnBackfillCriteria();
    this.backfillLoadError = '';
    this.irnBackfillPreview = null;
    this.irnBackfillCandidates = [];
    this.irnPreviewLoading = true;

    this.service.previewIrnBackfill(criteria).pipe(
      finalize(() => {
        this.irnPreviewLoading = false;
      })
    ).subscribe({
      next: (result) => {
        this.irnBackfillPreview = result;
        this.irnBackfillCandidates = (result?.invoices ?? result?.Invoices ?? [])
          .map((row) => this.normalizeInvoiceRow(row));
        const matched = this.getIrnTotalMatchedCount();
        if (matched === 0) {
          const msg = criteria.invoiceNumber
            ? `No backfill candidates found for invoice number "${criteria.invoiceNumber}".`
            : 'No backfill candidates found.';
          this.backfillLoadError = msg;
          this.snackBar.open(msg, 'Close', { duration: 5000 });
          return;
        }
        this.snackBar.open(
          `Matched ${matched} invoice(s); ${this.getIrnEstimatedBatchCount()} batch(es) of ${this.irnBatchSize}.`,
          'Close',
          { duration: 8000 }
        );
      },
      error: (err) => {
        this.backfillLoadError = this.extractError(err, 'Failed to preview backfill candidates.');
        this.snackBar.open(this.backfillLoadError, 'Close', { duration: 5000 });
      },
    });
  }

  canStartIrnBackfill(): boolean {
    return !!this.irnBackfillPreview && this.getIrnTotalMatchedCount() > 0;
  }

  getIrnTotalMatchedCount(): number {
    return this.irnBackfillPreview?.totalMatchedCount
      ?? this.irnBackfillPreview?.TotalMatchedCount
      ?? 0;
  }

  getIrnEstimatedBatchCount(): number {
    const fromPreview = this.irnBackfillPreview?.estimatedBatchCount
      ?? this.irnBackfillPreview?.EstimatedBatchCount;
    if (fromPreview && fromPreview > 0) {
      return fromPreview;
    }
    const total = this.getIrnTotalMatchedCount();
    return total > 0 ? Math.max(1, Math.ceil(total / this.irnBatchSize)) : 1;
  }

  getIrnRunButtonLabel(): string {
    const batches = this.getIrnEstimatedBatchCount();
    if (batches > 1) {
      return `Backfill IRN PDFs (all ${batches} batches)`;
    }
    return 'Backfill IRN PDFs';
  }

  formatInvoiceDate(value: string | Date | null | undefined): string {
    if (!value) return '—';
    const m = moment(value);
    return m.isValid() ? m.format('DD/MM/YYYY') : String(value);
  }

  startIrnBackfill(runAllBatches = true): void {
    if (!this.canStartIrnBackfill()) {
      return;
    }

    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }

    this.irnRunAllBatches = runAllBatches;
    this.irnBatchNumber = 0;
    this.irnAllBatchesProcessed = 0;
    this.irnTotalBatches = runAllBatches
      ? this.getIrnEstimatedBatchCount()
      : 1;
    this.backfilling = true;
    this.backfillCancelled = false;
    this.backfillLoadError = '';
    this.backfillProgressRows = [];

    this.startIrnBackfillBatch(performedBy);
  }

  private startIrnBackfillBatch(performedBy: number): void {
    const criteria = this.buildIrnBackfillCriteria();

    this.service.previewIrnBackfill(criteria).subscribe({
      next: (preview) => {
        const batchCount = preview?.candidateCount ?? preview?.CandidateCount ?? 0;
        if (batchCount <= 0) {
          this.backfilling = false;
          this.irnRunAllBatches = false;
          if (this.irnAllBatchesProcessed > 0) {
            this.snackBar.open(
              `All batches completed (${this.irnAllBatchesProcessed} invoice(s) processed).`,
              'Close',
              { duration: 10000 }
            );
          }
          return;
        }

        this.initBackfillProgressRowsFromPreview(preview);
        this.irnBatchNumber += 1;

        this.service.startIrnBackfillJob(criteria, performedBy).subscribe({
          next: (result) => {
            const jobId = result?.jobId ?? result?.JobId;
            if (!jobId) {
              this.backfilling = false;
              this.irnRunAllBatches = false;
              this.snackBar.open('Backfill job did not start.', 'Close', { duration: 5000 });
              return;
            }
            this.activeJob = this.normalizeJob({
              bulkUploadJobID: jobId,
          jobType: 'IrnBackfill',
              jobStatus: result?.jobStatus ?? result?.JobStatus ?? 'Pending',
              totalFiles: result?.totalInvoices ?? result?.TotalInvoices ?? batchCount,
          processedFiles: 0,
          successCount: 0,
          errorCount: 0,
            });
            this.jobErrors = [];
            this.startPolling(jobId, true, false);
      },
          error: (err) => {
        this.backfilling = false;
            this.irnRunAllBatches = false;
            this.backfillLoadError = this.extractError(err, 'Failed to start IRN backfill job.');
            this.snackBar.open(this.backfillLoadError, 'Close', { duration: 8000 });
          },
        });
      },
      error: (err) => {
        this.backfilling = false;
        this.irnRunAllBatches = false;
        this.snackBar.open(this.extractError(err, 'Failed to load backfill candidates.'), 'Close', { duration: 5000 });
      },
    });
  }

  private onIrnBatchJobFinished(errors: any[]): void {
    this.mergeBackfillProgress(errors || []);

    if (this.backfillCancelled) {
      this.backfilling = false;
      this.irnRunAllBatches = false;
      return;
    }

    const status = this.getJobStatus();
    if (status === 'Failed') {
      this.backfilling = false;
      this.irnRunAllBatches = false;
      this.snackBar.open('Batch failed. Remaining batches were not started.', 'Close', { duration: 8000 });
      return;
    }

    const processedThisBatch = this.activeJob?.processedFiles ?? this.activeJob?.ProcessedFiles ?? 0;
    this.irnAllBatchesProcessed += processedThisBatch;

    if (!this.irnRunAllBatches) {
      this.backfilling = false;
      this.snackBar.open('IRN backfill finished.', 'Close', { duration: 4000 });
      return;
    }

    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.backfilling = false;
      this.irnRunAllBatches = false;
      this.snackBar.open('User session expired before next batch could start.', 'Close', { duration: 8000 });
      return;
    }

    this.backfilling = true;
    this.snackBar.open(
      `Batch ${this.irnBatchNumber} of ${this.irnTotalBatches} finished. Starting next batch...`,
      'Close',
      { duration: 5000 }
    );
    setTimeout(() => this.startIrnBackfillBatch(performedBy), 1500);
  }

  private initBackfillProgressRowsFromPreview(preview: IrnBackfillPreviewResult): void {
    const invoices = (preview?.invoices ?? preview?.Invoices ?? [])
      .map((row) => this.normalizeInvoiceRow(row));
    const batchSize = preview?.candidateCount
      ?? preview?.CandidateCount
      ?? preview?.willProcessCount
      ?? preview?.WillProcessCount
      ?? invoices.length;

    this.backfillProgressRows = [];
    for (let index = 0; index < batchSize; index++) {
      const invoice = invoices[index];
      this.backfillProgressRows.push({
        invoiceID: invoice?.invoiceID ?? 0,
        invoiceNumberWithPrefix: invoice?.invoiceNumberWithPrefix ?? `Invoice ${index + 1}`,
        customerName: invoice?.customerName ?? '',
        status: 'Pending' as IrnBackfillProgressStatus,
        details: '',
        completedAt: null,
      });
    }
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
        this.notifySkippedNamingFile(fileName);
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
    if (jobType === 'IrnBackfill' || this.isClosingDutySlipJob()) return false;

    const status = this.getJobStatus();
    return status === 'Completed' || status === 'Partial';
  }

  isIrnBackfillJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'IrnBackfill';
  }

  isClosingDutySlipJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'ClosingDutySlipDryRun' || jobType === 'ClosingDutySlipProduction';
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
    const activeJobId = this.getActiveJobId();
    if (activeJobId && this.isIrnBackfillJob()) {
      this.service.cancelIrnBackfillJob(activeJobId).subscribe({ error: () => {} });
    }
    if (activeJobId && this.isClosingDutySlipJob()) {
      this.service.cancelClosingDutySlipBackfillJob(activeJobId).subscribe({ error: () => {} });
    }
    this.stopPolling();
    this.backfilling = false;
    this.closingBackfilling = false;
    this.activeJob = null;
    this.jobErrors = [];
    this.backfillProgressRows = [];
    this.closingBackfillProgressRows = [];
    this.closingCompletionSummary = null;
    this.closingJobStartedAt = null;
    this.closingRunAllBatches = false;
    this.closingBatchSkip = 0;
    this.closingBatchNumber = 0;
    this.closingTotalBatches = 0;
    this.closingAllBatchesProcessed = 0;
    this.irnRunAllBatches = false;
    this.irnBatchNumber = 0;
    this.irnTotalBatches = 0;
    this.irnAllBatchesProcessed = 0;
    this.pollIsIrnBackfill = false;
    this.pollIsClosingBackfill = false;
  }

  isBackfillRunning(): boolean {
    return this.backfilling || this.closingBackfilling || this.getJobStatus() === 'Processing';
  }

  previewClosingDutySlipBackfill(): void {
    const criteria = this.buildClosingDutySlipCriteria();
    this.closingBackfillLoadError = '';
    this.closingBackfillPreview = null;
    this.closingBackfillCandidates = [];
    this.closingCompletionSummary = null;
    this.closingPreviewLoading = true;

    this.service.previewClosingDutySlipBackfill(criteria).pipe(
      finalize(() => {
        this.closingPreviewLoading = false;
      })
    ).subscribe({
      next: (result) => {
        this.closingBackfillPreview = result;
        this.closingBackfillCandidates = this.normalizeClosingCandidates(
          result?.candidates ?? result?.Candidates ?? []
        );
        const matched = this.getClosingTotalMatchedCount();
        const willProcess = result?.willProcessCount ?? result?.WillProcessCount ?? 0;
        if (matched === 0) {
          const ids = this.parseDutySlipIds(this.closingDutySlipIdsCtrl.value);
          this.closingBackfillLoadError = ids.length > 0
            ? `No duty slips matched ID(s) ${ids.join(', ')}. Check that DutySlipImage is populated and the duty slip is active.`
            : 'No duty slips matched the selected criteria.';
        }
        this.snackBar.open(
          matched > 0
            ? `Matched ${matched} duty slip(s); up to ${willProcess} in this run. Source files are validated when you start the run.`
            : 'No duty slips matched the selected criteria.',
          'Close',
          { duration: 8000 }
        );
      },
      error: (err) => {
        this.closingBackfillLoadError = this.extractError(err, 'Failed to preview closing duty slip backfill.');
        this.snackBar.open(this.closingBackfillLoadError, 'Close', { duration: 8000 });
      },
    });
  }

  getClosingTotalMatchedCount(): number {
    return this.closingBackfillPreview?.totalMatchedCount
      ?? this.closingBackfillPreview?.TotalMatchedCount
      ?? 0;
  }

  canStartClosingBackfill(): boolean {
    return !!this.closingBackfillPreview && this.getClosingTotalMatchedCount() > 0;
  }

  startClosingDutySlipBackfill(runAllBatches = true): void {
    if (!this.canStartClosingBackfill()) {
      return;
    }

    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }

    this.closingRunAllBatches = runAllBatches;
    this.closingBatchSkip = 0;
    this.closingBatchNumber = 0;
    this.closingAllBatchesProcessed = 0;
    const totalMatched = this.getClosingTotalMatchedCount();
    this.closingTotalBatches = runAllBatches
      ? Math.max(1, Math.ceil(totalMatched / this.closingBatchSize))
      : 1;

    this.closingBackfilling = true;
    this.closingBackfillLoadError = '';
    this.closingCompletionSummary = null;
    this.closingBackfillProgressRows = [];
    this.closingJobStartedAt = Date.now();

    this.startClosingDutySlipBatch(performedBy);
  }

  private startClosingDutySlipBatch(performedBy: number): void {
    const criteria = this.buildClosingDutySlipCriteria(this.closingBatchSkip);

    this.service.startClosingDutySlipBackfillJob(criteria, performedBy).subscribe({
      next: (result) => {
        const jobId = result?.jobId ?? result?.JobId;
        if (!jobId) {
          this.closingBackfilling = false;
          this.closingRunAllBatches = false;
          this.snackBar.open('Backfill job did not start.', 'Close', { duration: 5000 });
          return;
        }
        this.closingBatchNumber = Math.floor(this.closingBatchSkip / this.closingBatchSize) + 1;
        this.activeJob = this.normalizeJob({
          bulkUploadJobID: jobId,
          jobType: criteria.targetMode === 'Production' ? 'ClosingDutySlipProduction' : 'ClosingDutySlipDryRun',
          jobStatus: result?.jobStatus ?? result?.JobStatus ?? 'Pending',
          totalFiles: result?.totalDutySlips ?? result?.TotalDutySlips ?? 0,
          processedFiles: 0,
          successCount: 0,
          errorCount: 0,
        });
        this.jobErrors = [];
        this.startPolling(jobId, false, true);
      },
      error: (err) => {
        this.closingBackfilling = false;
        this.closingRunAllBatches = false;
        this.closingBackfillLoadError = this.extractError(err, 'Failed to start closing duty slip backfill.');
        this.snackBar.open(this.closingBackfillLoadError, 'Close', { duration: 8000 });
      },
    });
  }

  private onClosingBatchJobFinished(errors: any[]): void {
    this.mergeClosingBackfillProgress(errors || []);
    this.buildClosingCompletionSummary(errors || []);

    const status = this.getJobStatus();
    if (status === 'Failed') {
      this.closingBackfilling = false;
      this.closingRunAllBatches = false;
      this.snackBar.open('Batch failed. Remaining batches were not started.', 'Close', { duration: 8000 });
      return;
    }

    const processedThisBatch = this.activeJob?.processedFiles ?? this.activeJob?.ProcessedFiles ?? 0;
    this.closingAllBatchesProcessed += processedThisBatch;
    this.closingBatchSkip += processedThisBatch;

    const totalMatched = this.getClosingTotalMatchedCount();
    const hasMoreBatches = this.closingRunAllBatches && this.closingBatchSkip < totalMatched;

    if (hasMoreBatches) {
      const performedBy = this.generalService.getUserID();
      if (!performedBy) {
        this.closingBackfilling = false;
        this.closingRunAllBatches = false;
        this.snackBar.open('User session expired before next batch could start.', 'Close', { duration: 8000 });
        return;
      }

      this.closingBackfilling = true;
      this.snackBar.open(
        `Batch ${this.closingBatchNumber} of ${this.closingTotalBatches} finished. Starting next batch...`,
        'Close',
        { duration: 5000 }
      );
      setTimeout(() => this.startClosingDutySlipBatch(performedBy), 1500);
      return;
    }

    this.closingBackfilling = false;
    this.closingRunAllBatches = false;
    if (this.closingTotalBatches > 1) {
      this.snackBar.open(
        `All ${this.closingTotalBatches} batch(es) completed (${this.closingAllBatchesProcessed} duty slip(s) processed).`,
        'Close',
        { duration: 10000 }
      );
    }
  }

  getClosingRunButtonLabel(): string {
    const batches = this.getClosingEstimatedBatchCount();
    const mode = this.closingTargetMode === 'Production' ? 'Production' : 'Dry Run';
    if (batches > 1) {
      return `Start ${mode} (all ${batches} batches)`;
    }
    return `Start ${mode}`;
  }

  getClosingEstimatedBatchCount(): number {
    const fromPreview = this.closingBackfillPreview?.estimatedBatchCount
      ?? this.closingBackfillPreview?.EstimatedBatchCount;
    if (fromPreview && fromPreview > 0) {
      return fromPreview;
    }
    const total = this.getClosingTotalMatchedCount();
    return total > 0 ? Math.max(1, Math.ceil(total / this.closingBatchSize)) : 1;
  }

  getClosingBatchProgressLabel(): string {
    if (!this.closingBackfilling && !this.isClosingDutySlipJob()) {
      return '';
    }
    if (this.closingTotalBatches <= 1) {
      return '';
    }
    return `Batch ${this.closingBatchNumber} of ${this.closingTotalBatches}`;
  }

  getClosingElapsedTime(): string {
    if (!this.closingJobStartedAt) return '—';
    const elapsedMs = Date.now() - this.closingJobStartedAt;
    const seconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remSeconds}s` : `${seconds}s`;
  }

  getClosingRemainingCount(): number {
    const total = this.activeJob?.totalFiles ?? this.activeJob?.TotalFiles ?? 0;
    const processed = this.activeJob?.processedFiles ?? this.activeJob?.ProcessedFiles ?? 0;
    return Math.max(0, total - processed);
  }

  getClosingSkippedCount(): number {
    return this.closingBackfillProgressRows.filter((row) => row.status === 'Skipped').length;
  }

  getClosingCurrentRecordLabel(): string {
    const rows = this.closingBackfillProgressRows;
    if (!rows.length) return '—';
    const last = rows[rows.length - 1];
    return `${last.dutySlipID} (${last.originalFile || 'n/a'})`;
  }

  getClosingProgressStatusClass(status: ClosingDutySlipBackfillProgressStatus): string {
    switch (status) {
      case 'Success':
        return 'progress-status-success';
      case 'Skipped':
        return 'progress-status-partial';
      case 'Failed':
        return 'progress-status-failed';
      case 'Processing':
        return 'progress-status-processing';
      default:
        return 'progress-status-pending';
    }
  }

  formatClosingPickUpDate(row: ClosingDutySlipBackfillCandidateRow | any): string {
    const value = row?.pickUpDate ?? row?.PickUpDate;
    if (!value) return '—';
    const m = moment(value);
    return m.isValid() ? m.format('DD MMM YYYY') : String(value);
  }

  formatClosingDutySlipImage(row: ClosingDutySlipBackfillCandidateRow | any): string {
    return this.stripDutySlipImageUrlPrefix(row?.dutySlipImage ?? row?.DutySlipImage ?? '');
  }

  private stripDutySlipImageUrlPrefix(value: string): string {
    if (!value) return '';
    const trimmed = value.trim().replace(/\\/g, '/');
    const prefixes = [
      'https://prodapi.ecoserp.in/StaticFiles/Images/',
      'http://prodapi.ecoserp.in/StaticFiles/Images/',
    ];
    const lower = trimmed.toLowerCase();
    for (const prefix of prefixes) {
      if (lower.startsWith(prefix.toLowerCase())) {
        return trimmed.substring(prefix.length);
      }
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      try {
        const url = new URL(trimmed);
        const name = url.pathname.split('/').filter(Boolean).pop();
        if (name) return name;
      } catch {
        // ignore
      }
    }
    const marker = 'staticfiles/images/';
    const markerIndex = lower.indexOf(marker);
    if (markerIndex >= 0) {
      return trimmed.substring(markerIndex + marker.length).replace(/^\/+/, '');
    }
    return trimmed;
  }

  private buildClosingDutySlipCriteria(skipCount = 0): ClosingDutySlipBackfillCriteria {
    const minDate = this.closingMinPickUpDateCtrl.value;
    const dutySlipIDs = this.parseDutySlipIds(this.closingDutySlipIdsCtrl.value);
    const criteria: ClosingDutySlipBackfillCriteria = {
      maxCandidates: this.closingBatchSize,
      skipCount,
      targetMode: this.closingTargetMode,
    };
    if (dutySlipIDs.length > 0) {
      criteria.dutySlipIDs = dutySlipIDs;
    } else {
      criteria.minPickUpDate = minDate ? moment(minDate).format('YYYY-MM-DD') : '2026-05-16';
    }
    return criteria;
  }

  private parseDutySlipIds(input: string | null | undefined): number[] {
    if (!input || !String(input).trim()) {
      return [];
    }

    const seen = new Set<number>();
    const ids: number[] = [];
    for (const part of String(input).split(/[,\s]+/)) {
      const trimmed = part.trim();
      if (!trimmed) {
        continue;
      }

      const parsed = Number.parseInt(trimmed, 10);
      if (!Number.isFinite(parsed) || parsed <= 0 || seen.has(parsed)) {
        continue;
      }

      seen.add(parsed);
      ids.push(parsed);
    }

    return ids;
  }

  private normalizeClosingCandidates(rows: any[]): ClosingDutySlipBackfillCandidateRow[] {
    return (rows || []).map((row) => ({
      dutySlipID: row?.dutySlipID ?? row?.DutySlipID,
      reservationID: row?.reservationID ?? row?.ReservationID ?? null,
      dutySlipImage: this.stripDutySlipImageUrlPrefix(row?.dutySlipImage ?? row?.DutySlipImage ?? ''),
      pickUpDate: row?.pickUpDate ?? row?.PickUpDate ?? null,
      status: row?.status ?? row?.Status ?? null,
      targetRelativePath: row?.targetRelativePath ?? row?.TargetRelativePath ?? null,
      hasActiveTargetDocument: row?.hasActiveTargetDocument ?? row?.HasActiveTargetDocument ?? false,
      destinationFileExists: row?.destinationFileExists ?? row?.DestinationFileExists ?? false,
      sourceFileExists: row?.sourceFileExists ?? row?.SourceFileExists ?? false,
      sourceFileType: row?.sourceFileType ?? row?.SourceFileType ?? null,
    }));
  }

  private mergeClosingBackfillProgress(errorRows: any[]): void {
    const sortedLogs = (errorRows || [])
      .map((row) => this.normalizeErrorRow(row))
      .sort((a, b) => {
        const ta = a.uploadTimestamp ? new Date(a.uploadTimestamp).getTime() : 0;
        const tb = b.uploadTimestamp ? new Date(b.uploadTimestamp).getTime() : 0;
        return ta - tb;
      });

    this.closingBackfillProgressRows = sortedLogs.map((log) => {
      const parsed = this.parseClosingLog(log.errorDescription);
      return {
        dutySlipID: parsed.dutySlipID,
        originalFile: parsed.originalFile,
        status: parsed.status,
        processingType: parsed.processingType,
        details: parsed.details,
        completedAt: log.uploadTimestamp || null,
      };
    });

    const total = this.activeJob?.totalFiles ?? this.activeJob?.TotalFiles ?? sortedLogs.length;
    const isRunning = this.getJobStatus() === 'Processing' || this.getJobStatus() === 'Pending';
    if (isRunning && this.closingBackfillProgressRows.length < total) {
      this.closingBackfillProgressRows = [
        ...this.closingBackfillProgressRows,
        {
          dutySlipID: 0,
          originalFile: '',
          status: 'Processing',
          processingType: '',
          details: 'Processing next record...',
          completedAt: null,
        },
      ];
    }
  }

  private parseClosingLog(description: string): {
    dutySlipID: number;
    originalFile: string;
    status: ClosingDutySlipBackfillProgressStatus;
    processingType: string;
    details: string;
  } {
    const text = description || '';
    let status: ClosingDutySlipBackfillProgressStatus = 'Failed';
    if (text.includes('[SUCCESS]')) status = 'Success';
    else if (text.includes('[SKIPPED]')) status = 'Skipped';
    else if (text.includes('[FAILED]')) status = 'Failed';

    const fields: Record<string, string> = {};
    text.split('|').forEach((part) => {
      const idx = part.indexOf('=');
      if (idx > 0) {
        fields[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
      }
    });

    return {
      dutySlipID: Number(fields.DutySlipID || 0),
      originalFile: fields.OriginalFile || '',
      status,
      processingType: fields.ProcessingType || '',
      details: fields.Error || fields.DestPath || text,
    };
  }

  private buildClosingCompletionSummary(errorRows: any[]): void {
    const rows = (errorRows || []).map((row) => this.parseClosingLog(this.normalizeErrorRow(row).errorDescription));
    const successful = rows.filter((r) => r.status === 'Success');
    const skipped = rows.filter((r) => r.status === 'Skipped');
    const failed = rows.filter((r) => r.status === 'Failed');
    const sourcePdfs = rows.filter((r) => (r.processingType || '').toLowerCase().includes('pdf copied')).length;
    const imagesConverted = rows.filter((r) => (r.processingType || '').toLowerCase().includes('image converted')).length;

    this.closingCompletionSummary = {
      totalRecords: this.closingBackfillPreview?.totalMatchedCount ?? this.activeJob?.totalFiles ?? rows.length,
      sourcePdfs: sourcePdfs,
      sourceImages: imagesConverted,
      pdfsCopied: sourcePdfs,
      imagesConverted,
      successful: successful.length,
      failed: failed.length,
      skipped: skipped.length,
      missingSourceFiles: skipped.filter((r) => (r.details || '').toLowerCase().includes('source')).length,
      unsupportedFileTypes: skipped.filter((r) => (r.details || '').toLowerCase().includes('unsupported')).length,
      databaseInserts: successful.length,
      totalProcessingTimeMs: this.closingJobStartedAt ? Date.now() - this.closingJobStartedAt : 0,
    };
  }

  displayCustomer(option: { customerName?: string } | string): string {
    if (!option) return '';
    return typeof option === 'string' ? option : (option.customerName || '');
  }

  formatBackfillCompletedAt(value: string | Date | null | undefined): string {
    if (!value) return '—';
    const m = moment(value);
    return m.isValid() ? m.format('DD/MM/YYYY HH:mm:ss') : String(value);
  }

  private startPolling(jobId: number, isIrnBackfill = false, isClosingBackfill = false): void {
    this.stopPolling();
    this.pollIsIrnBackfill = isIrnBackfill;
    this.pollIsClosingBackfill = isClosingBackfill;
    this.pollSub = timer(0, 2000)
      .pipe(
        switchMap(() =>
          forkJoin({
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
          } else if (isClosingBackfill) {
            this.mergeClosingBackfillProgress(errors || []);
            this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
          } else {
            this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
            await this.showNewNamingSkipModals(this.jobErrors);
          }
          const status = this.getJobStatus();
          if (status === 'Completed' || status === 'Partial' || status === 'Failed') {
            this.stopPolling();
            this.backfilling = false;
            if (isClosingBackfill) {
              this.onClosingBatchJobFinished(errors || []);
            } else if (isIrnBackfill) {
              this.onIrnBatchJobFinished(errors || []);
            } else {
              this.closingBackfilling = false;
              this.loadJobErrors(jobId);
            }
          }
        },
        () => this.stopPolling()
      );
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
    this.pollIsIrnBackfill = false;
    this.pollIsClosingBackfill = false;
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
      this.notifySkippedNamingFile(file.name);
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
      this.notifySkippedNamingFile(fileName);
    }
  }

  private notifySkippedNamingFile(fileName: string): void {
    this.snackBar.open(
      `${fileName} was skipped as it does not follow the Naming Convention`,
      'Close',
      { duration: 5000 }
    );
  }

  private getActiveJobId(): number | null {
    return this.activeJob?.bulkUploadJobID ?? this.activeJob?.BulkUploadJobID ?? null;
  }

  private buildIrnBackfillCriteria(): IrnBackfillSearchCriteria {
    const invoiceNumber = (this.backfillInvoiceNumberCtrl.value || '').trim();
    return {
      maxCandidates: this.irnBatchSize,
      invoiceNumber: invoiceNumber || null,
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
    const invoiceNumber = (this.invoiceNumberCtrl.value || '').trim();
    return {
      customerID: customer?.customerID || null,
      fromDate: this.formatApiDate(this.fromDateCtrl.value),
      toDate: this.formatApiDate(this.toDateCtrl.value),
      invoiceNumber: invoiceNumber || null,
    };
  }

  private getTodayDate(): Date {
    return moment().utcOffset('+05:30').startOf('day').toDate();
  }

  private resolveSelectedCustomer(): { customerID: number; customerName: string } | null {
    const value = this.customerCtrl.value;
    if (!value) return null;
    if (typeof value === 'object' && value.customerID) return value;
    const name = String(value).trim().toLowerCase();
    return this.customerList.find((c) => c.customerName.toLowerCase() === name) || null;
  }

  private initCustomerAutocomplete(): void {
    this.filteredCustomerOptions = this.customerCtrl.valueChanges.pipe(
      startWith(this.customerCtrl.value ?? ''),
      map((value) => this.filterCustomers(typeof value === 'string' ? value : value?.customerName || ''))
    );

    this.generalService.getCustomers().subscribe({
      next: (data) => {
      this.customerList = (data || [])
        .map((c) => ({
          customerID: c.customerID ?? c.CustomerID ?? 0,
          customerName: (c.customerName ?? c.CustomerName ?? '').trim(),
        }))
        .filter((c) => c.customerID && c.customerName);
        this.customerCtrl.updateValueAndValidity({ emitEvent: true });
      },
      error: () => {
        this.customerList = [];
      },
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
      if (err.trim() === 'Unknown Error') {
        return 'Cannot reach the API. Ensure the API is running (https://localhost:44368) and environment BaseURL is correct.';
      }
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
