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
  DutySlipDocumentBackfillCriteria,
  DutySlipDocumentBackfillPreviewResult,
  DutySlipDocumentBackfillCandidateRow,
  DocumentExistsFilter,
  DutySlipPackageDownloadCriteria,
  DutySlipPackageDownloadPreviewResult,
  DutySlipPackageDownloadRow,
  CreditNoteSearchCriteria,
  CreditNoteSummary,
  StartCreditNoteDownloadJobRequest,
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
  @ViewChild('creditNotePaginator') creditNotePaginator?: MatPaginator;

  activeTab: 'backfill' | 'download' | 'upload' | 'closingDutySlip' | 'verifiedDutySlip' | 'tollInterstate' | 'creditNote' = 'download';
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
  summaryIdCtrl = new FormControl('');
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

  readonly docBackfillMinFromDate = new Date(2026, 4, 15);
  readonly docBackfillMaxRangeDays = 15;
  readonly dutySlipPackageMaxRangeDays = 31;
  docBackfillBatchSize = 500;
  verifiedCustomerCtrl = new FormControl('');
  verifiedFromDateCtrl = new FormControl(this.getTodayDate());
  verifiedToDateCtrl = new FormControl(this.getTodayDate());
  verifiedDutySlipIdsCtrl = new FormControl('');
  dutySlipPackagePreview: DutySlipPackageDownloadPreviewResult | null = null;
  dutySlipPackageCandidates: DutySlipPackageDownloadRow[] = [];
  dutySlipPackageLoadError = '';
  dutySlipPackagePreviewLoading = false;
  dutySlipPackageDownloading = false;
  packageBatchSize = 500;
  packageRunAllBatches = false;
  packageBatchSkip = 0;
  packageBatchNumber = 0;
  packageTotalBatches = 0;
  packageAllBatchesProcessed = 0;
  packageAccumulatorZipPath: string | null = null;
  packageDownloadProgressRows: {
    dutySlipID: number;
    customerName: string;
    status: string;
    details: string;
    completedAt: string | null;
  }[] = [];
  packageDownloadProgressColumns = ['dutySlipID', 'customerName', 'status', 'details', 'completedAt'];
  packageJobStartedAt: number | null = null;
  verifiedTargetMode: ClosingDutySlipBackfillTargetMode = 'DryRun';
  verifiedExistsFilter: DocumentExistsFilter = 'All';
  verifiedBackfillPreview: DutySlipDocumentBackfillPreviewResult | null = null;
  verifiedBackfillCandidates: DutySlipDocumentBackfillCandidateRow[] = [];
  verifiedBackfillLoadError = '';
  verifiedBackfilling = false;
  verifiedPreviewLoading = false;
  verifiedBackfillProgressRows: ClosingDutySlipBackfillProgressRow[] = [];
  verifiedBackfillProgressColumns = ['dutySlipID', 'originalFile', 'status', 'processingType', 'details', 'completedAt'];
  verifiedBatchSkip = 0;
  verifiedBatchNumber = 0;
  verifiedTotalBatches = 0;
  verifiedAllBatchesProcessed = 0;
  verifiedRunAllBatches = false;
  verifiedJobStartedAt: number | null = null;

  tollCustomerCtrl = new FormControl('');
  tollFromDateCtrl = new FormControl(this.getTodayDate());
  tollToDateCtrl = new FormControl(this.getTodayDate());
  tollDutySlipIdsCtrl = new FormControl('');
  tollExistsFilter: DocumentExistsFilter = 'All';
  tollTargetMode: ClosingDutySlipBackfillTargetMode = 'DryRun';
  tollBackfillPreview: DutySlipDocumentBackfillPreviewResult | null = null;
  tollBackfillCandidates: DutySlipDocumentBackfillCandidateRow[] = [];
  tollBackfillLoadError = '';
  tollBackfilling = false;
  tollPreviewLoading = false;
  tollBackfillProgressRows: ClosingDutySlipBackfillProgressRow[] = [];
  tollBackfillProgressColumns = ['dutySlipID', 'originalFile', 'status', 'processingType', 'details', 'completedAt'];
  tollBatchSkip = 0;
  tollBatchNumber = 0;
  tollTotalBatches = 0;
  tollAllBatchesProcessed = 0;
  tollRunAllBatches = false;
  tollJobStartedAt: number | null = null;

  creditNoteCustomerCtrl = new FormControl('');
  creditNoteNumberCtrl = new FormControl('');
  creditNoteInvoiceNumberCtrl = new FormControl('');
  creditNoteFromDateCtrl = new FormControl(this.getTodayDate());
  creditNoteToDateCtrl = new FormControl(this.getTodayDate());
  creditNoteRows: CreditNoteSummary[] = [];
  creditNoteDataSource = new MatTableDataSource<CreditNoteSummary>([]);
  creditNoteSelection = new SelectionModel<CreditNoteSummary>(true, []);
  creditNoteDisplayedColumns = [
    'select',
    'creditNoteNumberWithPrefix',
    'dateTimeOfGeneration',
    'invoiceNumberWithPrefix',
    'customerName',
    'creditNoteAmount',
    'approvalStatus',
  ];
  creditNoteLoading = false;
  creditNoteLoadError = '';
  creditNoteDownloading = false;
  filteredCreditNoteCustomerOptions: Observable<{ customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[]> = of([]);

  downloadInvoices = false;
  downloadMerge = true;
  uploadType: 'reservationEmail' | 'dutySlip' = 'reservationEmail';
  uploadMode: 'bulk' | 'single' = 'bulk';

  customerList: { customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[] = [];
  filteredCustomerOptions: Observable<{ customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[]> = of([]);
  filteredVerifiedCustomerOptions: Observable<{ customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[]> = of([]);
  filteredTollCustomerOptions: Observable<{ customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[]> = of([]);

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
  private pollIsVerifiedBackfill = false;
  private pollIsTollBackfill = false;
  private pollIsPackageDownload = false;
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
    this.initDocBackfillCustomerAutocomplete(this.verifiedCustomerCtrl, (obs) => { this.filteredVerifiedCustomerOptions = obs; });
    this.initDocBackfillCustomerAutocomplete(this.tollCustomerCtrl, (obs) => { this.filteredTollCustomerOptions = obs; });
    this.initDocBackfillCustomerAutocomplete(this.creditNoteCustomerCtrl, (obs) => { this.filteredCreditNoteCustomerOptions = obs; });
  }

  ngAfterViewInit(): void {
    if (this.invoicePaginator) {
      this.invoiceDataSource.paginator = this.invoicePaginator;
    }
    if (this.creditNotePaginator) {
      this.creditNoteDataSource.paginator = this.creditNotePaginator;
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  setTab(tab: 'backfill' | 'download' | 'upload' | 'closingDutySlip' | 'verifiedDutySlip' | 'tollInterstate' | 'creditNote'): void {
    this.activeTab = tab;
  }

  setDownloadOption(option: 'invoices' | 'merge'): void {
    this.downloadInvoices = option === 'invoices';
    this.downloadMerge = option === 'merge';
  }

  onDownloadOptionChange(option: 'invoices' | 'merge', checked: boolean): void {
    if (checked) {
      this.setDownloadOption(option);
      return;
    }
    // Keep one option selected (mutually exclusive download modes).
    if (!this.downloadInvoices && !this.downloadMerge) {
      this.setDownloadOption(option);
    }
  }

  getSelectedDownloadMode(): string {
    if (this.downloadInvoices) return 'InvoicesOnly';
    if (this.downloadMerge) return 'Merge';
    return '';
  }

  getDownloadButtonLabel(): string {
    const count = this.selection.selected.length;
    return count ? `Download selected (${count})` : 'Download all results';
  }

  search(): void {
    const invoiceNumber = (this.invoiceNumberCtrl.value || '').trim();
    const summaryId = this.parseSummaryId();
    const hasDateRange = !!this.fromDateCtrl.value && !!this.toDateCtrl.value;
    const customer = this.resolveSelectedCustomer();

    if (summaryId === -1) {
      this.loadError = 'Summary ID must be a positive number';
      this.snackBar.open(this.loadError, 'Close', { duration: 4000 });
      return;
    }

    if (!invoiceNumber && !hasDateRange && !customer?.customerID && summaryId === null) {
      this.loadError = 'Please select customer, invoice number, summary ID, or date range';
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
          this.loadError = 'No archived invoice PDFs found for the selected criteria. Generate PDFs from Invoice Home (Actions → Generate PDFs) or run IRN PDF backfill on the Backfill tab first.';
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
    this.summaryIdCtrl.setValue('');
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
    this.creditNoteCustomerCtrl.setValue('');
    this.creditNoteNumberCtrl.setValue('');
    this.creditNoteInvoiceNumberCtrl.setValue('');
    this.creditNoteFromDateCtrl.setValue(this.getTodayDate());
    this.creditNoteToDateCtrl.setValue(this.getTodayDate());
    this.creditNoteRows = [];
    this.creditNoteDataSource.data = [];
    this.creditNoteSelection.clear();
    this.creditNoteLoadError = '';
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
    return !!this.activeJob && (
      this.activeTab === 'upload'
      || (this.activeTab === 'verifiedDutySlip' && this.isDutySlipPackageDownloadJob())
    );
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
            ? `No IRN backfill candidates for "${criteria.invoiceNumber}". Archives may already be complete (check Download tab), or the invoice has no IRN.`
            : 'No IRN backfill candidates found for the selected criteria.';
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

  searchCreditNotes(): void {
    const creditNoteNumber = (this.creditNoteNumberCtrl.value || '').trim();
    const invoiceNumber = (this.creditNoteInvoiceNumberCtrl.value || '').trim();
    const hasDateRange = !!this.creditNoteFromDateCtrl.value && !!this.creditNoteToDateCtrl.value;
    const customer = this.resolveSelectedCustomerFrom(this.creditNoteCustomerCtrl);

    if (!creditNoteNumber && !invoiceNumber && !hasDateRange && !customer?.customerID) {
      this.creditNoteLoadError = 'Please select customer, credit note number, invoice number, or date range';
      this.snackBar.open(this.creditNoteLoadError, 'Close', { duration: 4000 });
      return;
    }

    const criteria = this.buildCreditNoteSearchCriteria();
    this.creditNoteLoading = true;
    this.creditNoteLoadError = '';
    this.creditNoteSelection.clear();

    this.service.searchCreditNotes(criteria).subscribe(
      (rows) => {
        this.creditNoteRows = (rows || []).map((row) => this.normalizeCreditNoteRow(row));
        this.creditNoteDataSource.data = this.creditNoteRows;
        if (this.creditNotePaginator) {
          this.creditNoteDataSource.paginator = this.creditNotePaginator;
          this.creditNotePaginator.firstPage();
        }
        this.creditNoteLoading = false;
        if (!this.creditNoteRows.length) {
          this.creditNoteLoadError = 'No credit notes found for the selected criteria.';
        }
      },
      (err) => {
        this.creditNoteLoading = false;
        this.creditNoteRows = [];
        this.creditNoteDataSource.data = [];
        this.creditNoteLoadError = this.extractError(err, 'Failed to search credit notes.');
        this.snackBar.open(this.creditNoteLoadError, 'Close', { duration: 5000 });
      }
    );
  }

  isAllCreditNotesSelected(): boolean {
    const rows = this.creditNoteDataSource.data;
    return this.creditNoteSelection.selected.length === rows.length && rows.length > 0;
  }

  creditNoteMasterToggle(): void {
    const rows = this.creditNoteDataSource.data;
    if (this.isAllCreditNotesSelected()) {
      this.creditNoteSelection.clear();
      return;
    }
    this.creditNoteSelection.select(...rows);
  }

  getCreditNoteDownloadButtonLabel(): string {
    const count = this.creditNoteSelection.selected.length;
    return count ? `Download selected (${count})` : 'Download all results';
  }

  showCreditNoteTabJobPanel(): boolean {
    return !!this.activeJob && this.activeTab === 'creditNote' && this.isDownloadJob();
  }

  startCreditNoteDownload(): void {
    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }

    if (!this.creditNoteRows.length) {
      this.snackBar.open('Search for credit notes before downloading.', 'Close', { duration: 4000 });
      return;
    }

    const request: StartCreditNoteDownloadJobRequest = {
      ...this.buildCreditNoteSearchCriteria(),
    };

    const selectedIds = this.creditNoteSelection.selected.map((row) => row.invoiceCreditNoteID);
    if (selectedIds.length > 0) {
      request.creditNoteIDs = selectedIds;
    }

    this.creditNoteDownloading = true;
    this.service.startCreditNoteDownloadJob(request, performedBy).subscribe(
      (result) => {
        this.creditNoteDownloading = false;
        const jobId = result?.jobId ?? result?.JobId;
        this.snackBar.open(`Credit note download job ${jobId} started.`, 'Close', { duration: 4000 });
        this.startPolling(jobId);
      },
      (err) => {
        this.creditNoteDownloading = false;
        this.snackBar.open(this.extractError(err, 'Failed to start credit note download job.'), 'Close', { duration: 5000 });
      }
    );
  }

  private buildCreditNoteSearchCriteria(): CreditNoteSearchCriteria {
    const customer = this.resolveSelectedCustomerFrom(this.creditNoteCustomerCtrl);
    const creditNoteNumber = (this.creditNoteNumberCtrl.value || '').trim();
    const invoiceNumber = (this.creditNoteInvoiceNumberCtrl.value || '').trim();
    return {
      customerID: customer?.customerID || null,
      fromDate: this.formatApiDate(this.creditNoteFromDateCtrl.value),
      toDate: this.formatApiDate(this.creditNoteToDateCtrl.value),
      creditNoteNumber: creditNoteNumber || null,
      invoiceNumber: invoiceNumber || null,
    };
  }

  private normalizeCreditNoteRow(row: any): CreditNoteSummary {
    return {
      invoiceCreditNoteID: row.invoiceCreditNoteID ?? row.InvoiceCreditNoteID,
      creditNoteNumberWithPrefix: row.creditNoteNumberWithPrefix ?? row.CreditNoteNumberWithPrefix ?? '',
      dateTimeOfGeneration: row.dateTimeOfGeneration ?? row.DateTimeOfGeneration ?? null,
      creditNoteAmount: row.creditNoteAmount ?? row.CreditNoteAmount ?? 0,
      invoiceID: row.invoiceID ?? row.InvoiceID ?? 0,
      invoiceNumberWithPrefix: row.invoiceNumberWithPrefix ?? row.InvoiceNumberWithPrefix ?? '',
      customerName: row.customerName ?? row.CustomerName ?? '',
      approvalStatus: row.approvalStatus ?? row.ApprovalStatus ?? null,
    };
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
    if (jobType === 'IrnBackfill' || this.isClosingDutySlipJob() || this.isVerifiedDutySlipJob() || this.isTollInterstateJob()) return false;

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

  isVerifiedDutySlipJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'VerifiedDutySlipDryRun' || jobType === 'VerifiedDutySlipProduction';
  }

  isDutySlipPackageDownloadJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'DutySlipPackageDownload';
  }

  isTollInterstateJob(): boolean {
    const jobType = this.activeJob?.jobType || this.activeJob?.JobType || '';
    return jobType === 'TollInterstateDryRun' || jobType === 'TollInterstateProduction';
  }

  getTollRunButtonLabel(): string {
    const mode = this.tollTargetMode === 'Production' ? 'Production' : 'Dry Run';
    const batches = this.tollBackfillPreview?.estimatedBatchCount ?? this.tollBackfillPreview?.EstimatedBatchCount ?? 1;
    if (batches > 1) {
      return `Start ${mode} (all ${batches} batches)`;
    }
    return `Start ${mode}`;
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
    if (activeJobId && this.isVerifiedDutySlipJob()) {
      this.service.cancelVerifiedDutySlipBackfillJob(activeJobId).subscribe({ error: () => {} });
    }
    if (activeJobId && this.isTollInterstateJob()) {
      this.service.cancelTollInterstateBackfillJob(activeJobId).subscribe({ error: () => {} });
    }
    this.stopPolling();
    this.backfilling = false;
    this.closingBackfilling = false;
    this.verifiedBackfilling = false;
    this.tollBackfilling = false;
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
    this.pollIsVerifiedBackfill = false;
    this.pollIsTollBackfill = false;
    this.pollIsPackageDownload = false;
    this.verifiedBackfillProgressRows = [];
    this.tollBackfillProgressRows = [];
    this.verifiedBatchSkip = 0;
    this.verifiedBatchNumber = 0;
    this.verifiedTotalBatches = 0;
    this.verifiedAllBatchesProcessed = 0;
    this.verifiedRunAllBatches = false;
    this.verifiedJobStartedAt = null;
    this.tollBatchSkip = 0;
    this.tollBatchNumber = 0;
    this.tollTotalBatches = 0;
    this.tollAllBatchesProcessed = 0;
    this.tollRunAllBatches = false;
    this.tollJobStartedAt = null;
    this.dutySlipPackageDownloading = false;
    this.packageRunAllBatches = false;
    this.packageBatchSkip = 0;
    this.packageBatchNumber = 0;
    this.packageTotalBatches = 0;
    this.packageAllBatchesProcessed = 0;
    this.packageAccumulatorZipPath = null;
    this.packageDownloadProgressRows = [];
    this.packageJobStartedAt = null;
  }

  isBackfillRunning(): boolean {
    return this.backfilling
      || this.closingBackfilling
      || this.verifiedBackfilling
      || this.tollBackfilling
      || this.dutySlipPackageDownloading
      || this.getJobStatus() === 'Processing';
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

  isClosingStuckJobError(): boolean {
    const msg = (this.closingBackfillLoadError || '').toLowerCase();
    return msg.includes('already running') || msg.includes('stuck');
  }

  forceClearStuckClosingDutySlipBackfill(): void {
    this.closingBackfillLoadError = '';
    this.service.forceClearStuckClosingDutySlipBackfill().subscribe({
      next: (result) => {
        const cleared = result?.clearedCount ?? result?.ClearedCount ?? 0;
        const message =
          result?.message ??
          result?.Message ??
          (cleared > 0
            ? `Cleared ${cleared} stuck closing duty slip backfill job(s).`
            : 'No stuck closing duty slip backfill jobs were found.');
        this.closingBackfilling = false;
        this.closingRunAllBatches = false;
        this.activeJob = null;
        this.pollIsClosingBackfill = false;
        this.stopPolling();
        this.snackBar.open(message, 'Close', { duration: 8000 });
      },
      error: (err) => {
        this.closingBackfillLoadError = this.extractError(err, 'Failed to clear stuck backfill job.');
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
    return this.getDocBackfillCurrentRecordLabel(this.closingBackfillProgressRows);
  }

  getVerifiedTotalMatchedCount(): number {
    return this.verifiedBackfillPreview?.totalMatchedCount
      ?? this.verifiedBackfillPreview?.TotalMatchedCount
      ?? 0;
  }

  getTollTotalMatchedCount(): number {
    return this.tollBackfillPreview?.totalMatchedCount
      ?? this.tollBackfillPreview?.TotalMatchedCount
      ?? 0;
  }

  getVerifiedBatchProgressLabel(): string {
    return this.getDocBackfillBatchProgressLabel(
      this.verifiedBackfilling,
      this.isVerifiedDutySlipJob(),
      this.verifiedBatchNumber,
      this.verifiedTotalBatches
    );
  }

  getTollBatchProgressLabel(): string {
    return this.getDocBackfillBatchProgressLabel(
      this.tollBackfilling,
      this.isTollInterstateJob(),
      this.tollBatchNumber,
      this.tollTotalBatches
    );
  }

  getVerifiedElapsedTime(): string {
    return this.formatDocBackfillElapsedTime(this.verifiedJobStartedAt);
  }

  getTollElapsedTime(): string {
    return this.formatDocBackfillElapsedTime(this.tollJobStartedAt);
  }

  getVerifiedRemainingCount(): number {
    return this.getDocBackfillRemainingCount();
  }

  getTollRemainingCount(): number {
    return this.getDocBackfillRemainingCount();
  }

  getVerifiedSkippedCount(): number {
    return this.getDocBackfillSkippedCount(this.verifiedBackfillProgressRows);
  }

  getTollSkippedCount(): number {
    return this.getDocBackfillSkippedCount(this.tollBackfillProgressRows);
  }

  getVerifiedCurrentRecordLabel(): string {
    return this.getDocBackfillCurrentRecordLabel(this.verifiedBackfillProgressRows);
  }

  getTollCurrentRecordLabel(): string {
    return this.getDocBackfillCurrentRecordLabel(this.tollBackfillProgressRows);
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

  displayCustomer(option: { customerName?: string; displayName?: string } | string): string {
    if (!option) return '';
    if (typeof option === 'string') return option;
    return option.displayName || option.customerName || '';
  }

  validateDutySlipPackageDates(fromCtrl: FormControl, toCtrl: FormControl): string | null {
    const fromVal = fromCtrl.value;
    const toVal = toCtrl.value;
    if (!fromVal || !toVal) {
      return 'From Date and To Date are required when Duty Slip IDs are not entered.';
    }
    const fromDate = moment(fromVal).startOf('day');
    const toDate = moment(toVal).startOf('day');
    if (toDate.isBefore(fromDate)) {
      return 'To Date cannot be earlier than From Date.';
    }
    if (toDate.diff(fromDate, 'days') + 1 > this.dutySlipPackageMaxRangeDays) {
      return `Date range cannot exceed ${this.dutySlipPackageMaxRangeDays} days.`;
    }
    return null;
  }

  buildDutySlipPackageCriteria(skipCount = 0): DutySlipPackageDownloadCriteria {
    const customer = this.resolveSelectedCustomerFrom(this.verifiedCustomerCtrl);
    const dutySlipIDs = this.parseDutySlipIds(this.verifiedDutySlipIdsCtrl.value);
    const criteria: DutySlipPackageDownloadCriteria = {
      customerID: customer?.customerID || 0,
      maxCandidates: this.packageBatchSize,
      skipCount,
    };
    if (this.packageAccumulatorZipPath) {
      criteria.accumulatorZipRelativePath = this.packageAccumulatorZipPath;
    }
    if (dutySlipIDs.length > 0) {
      criteria.dutySlipIDs = dutySlipIDs;
    } else {
      criteria.fromDate = this.formatApiDate(this.verifiedFromDateCtrl.value);
      criteria.toDate = this.formatApiDate(this.verifiedToDateCtrl.value);
    }
    return criteria;
  }

  getPackageTotalMatchedCount(): number {
    return this.dutySlipPackagePreview?.totalMatchedCount ?? 0;
  }

  getPackageEstimatedBatchCount(): number {
    const fromPreview = this.dutySlipPackagePreview?.estimatedBatchCount;
    if (fromPreview && fromPreview > 0) {
      return fromPreview;
    }
    const total = this.getPackageTotalMatchedCount();
    return total > 0 ? Math.max(1, Math.ceil(total / this.packageBatchSize)) : 1;
  }

  getPackageRunButtonLabel(): string {
    const batches = this.getPackageEstimatedBatchCount();
    if (batches > 1) {
      return `Start download (all ${batches} batches)`;
    }
    return 'Start download';
  }

  getPackageBatchProgressLabel(): string {
    if (!this.dutySlipPackageDownloading && !this.isDutySlipPackageDownloadJob()) {
      return '';
    }
    if (this.packageTotalBatches <= 1) {
      return '';
    }
    return `Batch ${this.packageBatchNumber} of ${this.packageTotalBatches}`;
  }

  previewDutySlipPackageDownload(): void {
    const customer = this.resolveSelectedCustomerFrom(this.verifiedCustomerCtrl);
    if (!customer?.customerID) {
      this.dutySlipPackageLoadError = 'Customer is required.';
      this.snackBar.open(this.dutySlipPackageLoadError, 'Close', { duration: 5000 });
      return;
    }
    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }
    const dutySlipIDs = this.parseDutySlipIds(this.verifiedDutySlipIdsCtrl.value);
    if (dutySlipIDs.length === 0) {
      const dateError = this.validateDutySlipPackageDates(this.verifiedFromDateCtrl, this.verifiedToDateCtrl);
      if (dateError) {
        this.dutySlipPackageLoadError = dateError;
        this.snackBar.open(dateError, 'Close', { duration: 5000 });
        return;
      }
    }
    this.dutySlipPackageLoadError = '';
    this.dutySlipPackagePreviewLoading = true;
    this.service.previewDutySlipPackageDownload(this.buildDutySlipPackageCriteria(), performedBy).pipe(
      finalize(() => { this.dutySlipPackagePreviewLoading = false; })
    ).subscribe({
      next: (result) => {
        this.dutySlipPackagePreview = result;
        this.dutySlipPackageCandidates = this.normalizeDutySlipPackageCandidates(result?.candidates ?? []);
        const matched = result?.totalMatchedCount ?? 0;
        const batches = result?.estimatedBatchCount ?? this.getPackageEstimatedBatchCount();
        this.snackBar.open(
          matched > 0
            ? `Matched ${matched} duty slip(s); ${batches} batch(es) of ${this.packageBatchSize}.`
            : 'No duty slips matched.',
          'Close',
          { duration: 8000 }
        );
      },
      error: (err) => {
        this.dutySlipPackageLoadError = this.extractError(err, 'Failed to preview duty slip download.');
        this.snackBar.open(this.dutySlipPackageLoadError, 'Close', { duration: 8000 });
      },
    });
  }

  canStartDutySlipPackageDownload(): boolean {
    return !!(this.dutySlipPackagePreview && (this.dutySlipPackagePreview.totalMatchedCount ?? 0) > 0);
  }

  startDutySlipPackageDownload(runAllBatches = true): void {
    if (!this.canStartDutySlipPackageDownload()) return;

    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }

    this.packageRunAllBatches = runAllBatches;
    this.packageBatchSkip = 0;
    this.packageBatchNumber = 0;
    this.packageAllBatchesProcessed = 0;
    this.packageAccumulatorZipPath = null;
    this.packageTotalBatches = runAllBatches
      ? this.getPackageEstimatedBatchCount()
      : 1;
    this.dutySlipPackageDownloading = true;
    this.dutySlipPackageLoadError = '';
    this.packageDownloadProgressRows = [];
    this.packageJobStartedAt = Date.now();

    this.startDutySlipPackageBatch(performedBy);
  }

  private startDutySlipPackageBatch(performedBy: number): void {
    const criteria = this.buildDutySlipPackageCriteria(this.packageBatchSkip);

    this.service.startDutySlipPackageDownloadJob(criteria, performedBy).subscribe({
      next: (result) => {
        const jobId = result?.jobId ?? result?.JobId;
        if (!jobId) {
          this.dutySlipPackageDownloading = false;
          this.packageRunAllBatches = false;
          this.snackBar.open('Download job did not start.', 'Close', { duration: 5000 });
          return;
        }

        this.packageBatchNumber = Math.floor(this.packageBatchSkip / this.packageBatchSize) + 1;
        this.initPackageDownloadProgressRows();
        this.activeJob = this.normalizeJob({
          bulkUploadJobID: jobId,
          jobType: 'DutySlipPackageDownload',
          jobStatus: result?.jobStatus ?? result?.JobStatus ?? 'Pending',
          totalFiles: result?.totalDutySlips ?? result?.TotalDutySlips ?? 0,
          processedFiles: 0,
          successCount: 0,
          errorCount: 0,
        });
        this.jobErrors = [];
        this.startPolling(jobId, false, false, false, false, true);
      },
      error: (err) => {
        this.dutySlipPackageDownloading = false;
        this.packageRunAllBatches = false;
        const message = this.extractError(err, 'Failed to start duty slip download.');
        this.dutySlipPackageLoadError = message;
        this.snackBar.open(message, 'Close', { duration: 8000 });
      },
    });
  }

  private initPackageDownloadProgressRows(): void {
    const batchSize = this.activeJob?.totalFiles ?? this.packageBatchSize;
    const candidates = this.dutySlipPackageCandidates.slice(0, batchSize);
    this.packageDownloadProgressRows = [];
    for (let index = 0; index < batchSize; index++) {
      const row = candidates[index];
      this.packageDownloadProgressRows.push({
        dutySlipID: row?.dutySlipID ?? 0,
        customerName: row?.customerName ?? '',
        status: 'Pending',
        details: '',
        completedAt: null,
      });
    }
  }

  private onPackageBatchJobFinished(errors: any[]): void {
    this.mergePackageDownloadProgress(errors || []);

    const status = this.getJobStatus();
    if (status === 'Failed') {
      this.dutySlipPackageDownloading = false;
      this.packageRunAllBatches = false;
      this.snackBar.open('Batch failed. Remaining batches were not started.', 'Close', { duration: 8000 });
      return;
    }

    const processedThisBatch = this.activeJob?.processedFiles ?? this.activeJob?.ProcessedFiles ?? 0;
    this.packageAllBatchesProcessed += processedThisBatch;
    this.packageBatchSkip += processedThisBatch;

    if (!this.packageAccumulatorZipPath && this.activeJob?.resultFilePath) {
      this.packageAccumulatorZipPath = this.activeJob.resultFilePath;
    }

    const totalMatched = this.getPackageTotalMatchedCount();
    const hasMoreBatches = this.packageRunAllBatches && this.packageBatchSkip < totalMatched;

    if (hasMoreBatches) {
      const performedBy = this.generalService.getUserID();
      if (!performedBy) {
        this.dutySlipPackageDownloading = false;
        this.packageRunAllBatches = false;
        this.snackBar.open('User session expired before next batch could start.', 'Close', { duration: 8000 });
        return;
      }

      this.dutySlipPackageDownloading = true;
      this.snackBar.open(
        `Batch ${this.packageBatchNumber} of ${this.packageTotalBatches} finished. Starting next batch...`,
        'Close',
        { duration: 5000 }
      );
      setTimeout(() => this.startDutySlipPackageBatch(performedBy), 1500);
      return;
    }

    this.dutySlipPackageDownloading = false;
    this.packageRunAllBatches = false;
    if (this.packageTotalBatches > 1) {
      this.snackBar.open(
        `All ${this.packageTotalBatches} batch(es) completed (${this.packageAllBatchesProcessed} duty slip(s) processed). Download ZIP when ready.`,
        'Close',
        { duration: 10000 }
      );
    } else {
      this.snackBar.open('Duty slip download finished. Download ZIP when ready.', 'Close', { duration: 6000 });
    }
  }

  private mergePackageDownloadProgress(errorRows: any[]): void {
    const sortedLogs = (errorRows || [])
      .map((row) => this.normalizeErrorRow(row))
      .sort((a, b) => {
        const ta = a.uploadTimestamp ? new Date(a.uploadTimestamp).getTime() : 0;
        const tb = b.uploadTimestamp ? new Date(b.uploadTimestamp).getTime() : 0;
        return ta - tb;
      });

    const rows = sortedLogs.map((log) => {
      const parsed = this.parsePackageDownloadLog(log.errorDescription);
      const candidate = this.packageDownloadProgressRows.find((row) => row.dutySlipID === parsed.dutySlipID);
      return {
        dutySlipID: parsed.dutySlipID,
        customerName: candidate?.customerName ?? '',
        status: parsed.status,
        details: parsed.details,
        completedAt: log.uploadTimestamp || null,
      };
    });

    if (rows.length > 0) {
      this.packageDownloadProgressRows = rows;
    }

    const total = this.activeJob?.totalFiles ?? this.activeJob?.TotalFiles ?? this.packageDownloadProgressRows.length;
    const isRunning = this.getJobStatus() === 'Processing' || this.getJobStatus() === 'Pending';
    if (isRunning && this.packageDownloadProgressRows.length < total) {
      this.packageDownloadProgressRows = [
        ...this.packageDownloadProgressRows,
        {
          dutySlipID: 0,
          customerName: '',
          status: 'Processing',
          details: 'Processing next duty slip...',
          completedAt: null,
        },
      ];
    }
  }

  private parsePackageDownloadLog(description: string): { dutySlipID: number; status: string; details: string } {
    const text = description || '';
    let status = 'Failed';
    if (text.includes('[SUCCESS]')) status = 'Success';
    else if (text.includes('[PARTIAL]')) status = 'Partial';
    else if (text.includes('[FAILED]')) status = 'Failed';

    const fields: Record<string, string> = {};
    const body = text.replace(/^\[(SUCCESS|PARTIAL|FAILED)\]\s*/, '');
    body.split('|').forEach((part) => {
      const idx = part.indexOf('=');
      if (idx > 0) {
        fields[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
      }
    });

    return {
      dutySlipID: Number(fields.DutySlipID || 0),
      status,
      details: fields.Details || text,
    };
  }

  formatSlipSource(source?: string | null): string {
    switch ((source || '').toLowerCase()) {
      case 'archived': return 'Archived';
      case 'manualimage': return 'Manual scan';
      case 'systemprint': return 'System print';
      default: return source || '—';
    }
  }

  private normalizeDutySlipPackageCandidates(rows: any[]): DutySlipPackageDownloadRow[] {
    return (rows || []).map((row) => ({
      dutySlipID: row.dutySlipID ?? row.DutySlipID ?? 0,
      reservationID: row.reservationID ?? row.ReservationID ?? null,
      customerName: row.customerName ?? row.CustomerName ?? null,
      pickUpDate: row.pickUpDate ?? row.PickUpDate ?? null,
      tollReceiptCount: row.tollReceiptCount ?? row.TollReceiptCount ?? 0,
      interstateReceiptCount: row.interstateReceiptCount ?? row.InterstateReceiptCount ?? 0,
      slipSource: row.slipSource ?? row.SlipSource ?? null,
    }));
  }

  validateDocBackfillDates(fromCtrl: FormControl, toCtrl: FormControl): string | null {
    const fromVal = fromCtrl.value;
    const toVal = toCtrl.value;
    if (!fromVal || !toVal) {
      return 'From Date and To Date are required when Duty Slip IDs are not entered.';
    }
    const fromDate = moment(fromVal).startOf('day');
    const toDate = moment(toVal).startOf('day');
    const minDate = moment(this.docBackfillMinFromDate).startOf('day');
    if (fromDate.isBefore(minDate)) {
      return `From Date cannot be earlier than ${minDate.format('DD-MM-YYYY')}.`;
    }
    if (toDate.isBefore(fromDate)) {
      return 'To Date cannot be earlier than From Date.';
    }
    if (toDate.diff(fromDate, 'days') > this.docBackfillMaxRangeDays) {
      return `Date range cannot exceed ${this.docBackfillMaxRangeDays} days.`;
    }
    return null;
  }

  previewVerifiedDutySlipBackfill(): void {
    const customer = this.resolveSelectedCustomerFrom(this.verifiedCustomerCtrl);
    if (!customer?.customerID) {
      this.verifiedBackfillLoadError = 'Customer is required.';
      this.snackBar.open(this.verifiedBackfillLoadError, 'Close', { duration: 5000 });
      return;
    }
    const dutySlipIDs = this.parseDutySlipIds(this.verifiedDutySlipIdsCtrl.value);
    if (dutySlipIDs.length === 0) {
      const dateError = this.validateDocBackfillDates(this.verifiedFromDateCtrl, this.verifiedToDateCtrl);
      if (dateError) {
        this.verifiedBackfillLoadError = dateError;
        this.snackBar.open(dateError, 'Close', { duration: 5000 });
        return;
      }
    }
    this.verifiedBackfillLoadError = '';
    this.verifiedPreviewLoading = true;
    this.service.previewVerifiedDutySlipBackfill(this.buildVerifiedDutySlipCriteria()).pipe(
      finalize(() => { this.verifiedPreviewLoading = false; })
    ).subscribe({
      next: (result) => {
        this.verifiedBackfillPreview = result;
        this.verifiedBackfillCandidates = this.normalizeDocBackfillCandidates(result?.candidates ?? result?.Candidates ?? []);
        const matched = result?.totalMatchedCount ?? result?.TotalMatchedCount ?? 0;
        this.snackBar.open(matched > 0 ? `Matched ${matched} duty slip(s).` : 'No duty slips matched.', 'Close', { duration: 8000 });
      },
      error: (err) => {
        this.verifiedBackfillLoadError = this.extractError(err, 'Failed to preview verified duty slip backfill.');
        this.snackBar.open(this.verifiedBackfillLoadError, 'Close', { duration: 8000 });
      },
    });
  }

  canStartVerifiedBackfill(): boolean {
    return !!(this.verifiedBackfillPreview && (this.verifiedBackfillPreview.totalMatchedCount ?? this.verifiedBackfillPreview.TotalMatchedCount));
  }

  startVerifiedDutySlipBackfill(runAllBatches = true): void {
    if (!this.canStartVerifiedBackfill()) return;
    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }
    this.verifiedRunAllBatches = runAllBatches;
    this.verifiedBatchSkip = 0;
    this.verifiedBatchNumber = 0;
    this.verifiedAllBatchesProcessed = 0;
    this.verifiedTotalBatches = this.getDocBackfillEstimatedBatchCount(this.verifiedBackfillPreview, this.docBackfillBatchSize);
    this.verifiedBackfilling = true;
    this.verifiedBackfillProgressRows = [];
    this.verifiedJobStartedAt = Date.now();
    this.startVerifiedDutySlipBatch(performedBy);
  }

  previewTollInterstateBackfill(): void {
    const customer = this.resolveSelectedCustomerFrom(this.tollCustomerCtrl);
    if (!customer?.customerID) {
      this.tollBackfillLoadError = 'Customer is required.';
      this.snackBar.open(this.tollBackfillLoadError, 'Close', { duration: 5000 });
      return;
    }
    const dutySlipIDs = this.parseDutySlipIds(this.tollDutySlipIdsCtrl.value);
    if (dutySlipIDs.length === 0) {
      const dateError = this.validateDocBackfillDates(this.tollFromDateCtrl, this.tollToDateCtrl);
      if (dateError) {
        this.tollBackfillLoadError = dateError;
        this.snackBar.open(dateError, 'Close', { duration: 5000 });
        return;
      }
    }
    this.tollBackfillLoadError = '';
    this.tollPreviewLoading = true;
    this.service.previewTollInterstateBackfill(this.buildTollInterstateCriteria()).pipe(
      finalize(() => { this.tollPreviewLoading = false; })
    ).subscribe({
      next: (result) => {
        this.tollBackfillPreview = result;
        this.tollBackfillCandidates = this.normalizeDocBackfillCandidates(result?.candidates ?? result?.Candidates ?? []);
        const matched = result?.totalMatchedCount ?? result?.TotalMatchedCount ?? 0;
        this.snackBar.open(matched > 0 ? `Matched ${matched} duty slip(s).` : 'No duty slips matched.', 'Close', { duration: 8000 });
      },
      error: (err) => {
        this.tollBackfillLoadError = this.extractError(err, 'Failed to preview toll/interstate backfill.');
        this.snackBar.open(this.tollBackfillLoadError, 'Close', { duration: 8000 });
      },
    });
  }

  canStartTollBackfill(): boolean {
    return !!(this.tollBackfillPreview && (this.tollBackfillPreview.totalMatchedCount ?? this.tollBackfillPreview.TotalMatchedCount));
  }

  startTollInterstateBackfill(runAllBatches = true): void {
    if (!this.canStartTollBackfill()) return;
    const performedBy = this.generalService.getUserID();
    if (!performedBy) {
      this.snackBar.open('User session not found.', 'Close', { duration: 4000 });
      return;
    }
    this.tollRunAllBatches = runAllBatches;
    this.tollBatchSkip = 0;
    this.tollBatchNumber = 0;
    this.tollAllBatchesProcessed = 0;
    this.tollTotalBatches = this.getDocBackfillEstimatedBatchCount(this.tollBackfillPreview, this.docBackfillBatchSize);
    this.tollBackfilling = true;
    this.tollBackfillProgressRows = [];
    this.tollJobStartedAt = Date.now();
    this.startTollInterstateBatch(performedBy);
  }

  forceClearStuckVerifiedDutySlipBackfill(): void {
    this.service.forceClearStuckVerifiedDutySlipBackfill().subscribe({
      next: (res) => {
        this.snackBar.open(res?.message || `Cleared ${res?.clearedCount ?? 0} stuck job(s).`, 'Close', { duration: 6000 });
        this.verifiedBackfilling = false;
      },
      error: (err) => this.snackBar.open(this.extractError(err, 'Failed to clear stuck job.'), 'Close', { duration: 6000 }),
    });
  }

  forceClearStuckTollInterstateBackfill(): void {
    this.service.forceClearStuckTollInterstateBackfill().subscribe({
      next: (res) => {
        this.snackBar.open(res?.message || `Cleared ${res?.clearedCount ?? 0} stuck job(s).`, 'Close', { duration: 6000 });
        this.tollBackfilling = false;
      },
      error: (err) => this.snackBar.open(this.extractError(err, 'Failed to clear stuck job.'), 'Close', { duration: 6000 }),
    });
  }

  isVerifiedStuckJobError(): boolean {
    return !!(this.verifiedBackfillLoadError && /already running|stuck|in-memory lock/i.test(this.verifiedBackfillLoadError));
  }

  isTollStuckJobError(): boolean {
    return !!(this.tollBackfillLoadError && /already running|stuck|in-memory lock/i.test(this.tollBackfillLoadError));
  }

  formatBackfillCompletedAt(value: string | Date | null | undefined): string {
    if (!value) return '—';
    const m = moment.utc(value).utcOffset('+05:30');
    return m.isValid() ? m.format('DD/MM/YYYY HH:mm:ss') : String(value);
  }

  private startPolling(jobId: number, isIrnBackfill = false, isClosingBackfill = false, isVerifiedBackfill = false, isTollBackfill = false, isPackageDownload = false): void {
    this.stopPolling();
    this.pollIsIrnBackfill = isIrnBackfill;
    this.pollIsClosingBackfill = isClosingBackfill;
    this.pollIsVerifiedBackfill = isVerifiedBackfill;
    this.pollIsTollBackfill = isTollBackfill;
    this.pollIsPackageDownload = isPackageDownload;
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
          } else if (isVerifiedBackfill) {
            this.mergeDocBackfillProgress(errors || [], 'verified');
            this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
          } else if (isTollBackfill) {
            this.mergeDocBackfillProgress(errors || [], 'toll');
            this.jobErrors = (errors || []).map((row) => this.normalizeErrorRow(row));
          } else if (isPackageDownload) {
            this.mergePackageDownloadProgress(errors || []);
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
            } else if (isVerifiedBackfill) {
              this.onDocBackfillBatchJobFinished('verified', errors || []);
            } else if (isTollBackfill) {
              this.onDocBackfillBatchJobFinished('toll', errors || []);
            } else if (isPackageDownload) {
              this.onPackageBatchJobFinished(errors || []);
            } else if (isIrnBackfill) {
              this.onIrnBatchJobFinished(errors || []);
            } else {
              this.closingBackfilling = false;
              this.verifiedBackfilling = false;
              this.tollBackfilling = false;
              this.dutySlipPackageDownloading = false;
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
    this.pollIsVerifiedBackfill = false;
    this.pollIsTollBackfill = false;
    this.pollIsPackageDownload = false;
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
    const summaryId = this.parseSummaryId();
    return {
      customerID: customer?.customerID || null,
      fromDate: this.formatApiDate(this.fromDateCtrl.value),
      toDate: this.formatApiDate(this.toDateCtrl.value),
      invoiceNumber: invoiceNumber || null,
      summaryID: summaryId,
    };
  }

  private parseSummaryId(): number | null {
    const raw = (this.summaryIdCtrl.value || '').toString().trim();
    if (!raw) {
      return null;
    }
    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed) || parsed <= 0 || String(parsed) !== raw) {
      return -1;
    }
    return parsed;
  }

  private getTodayDate(): Date {
    return moment().utcOffset('+05:30').startOf('day').toDate();
  }

  private resolveSelectedCustomer(): { customerID: number; customerName: string } | null {
    return this.resolveSelectedCustomerFrom(this.customerCtrl);
  }

  private initCustomerAutocomplete(): void {
      this.filteredCustomerOptions = this.customerCtrl.valueChanges.pipe(
      startWith(this.customerCtrl.value ?? ''),
      map((value) => this.filterCustomers(typeof value === 'string' ? value : value?.displayName || value?.customerName || ''))
    );

    this.generalService.getCustomers().subscribe({
      next: (data) => {
        this.customerList = this.mapCustomerList(data);
        this.customerCtrl.updateValueAndValidity({ emitEvent: true });
      },
      error: () => {
        this.customerList = [];
      },
    });
  }

  private initDocBackfillCustomerAutocomplete(
    ctrl: FormControl,
    assign: (obs: Observable<{ customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[]>) => void
  ): void {
    assign(ctrl.valueChanges.pipe(
      startWith(ctrl.value ?? ''),
      map((value) => this.filterCustomers(typeof value === 'string' ? value : value?.displayName || value?.customerName || ''))
    ));
  }

  private mapCustomerList(data: any[]): { customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[] {
    return (data || [])
      .map((c) => {
        const customerID = c.customerID ?? c.CustomerID ?? 0;
        const customerName = (c.customerName ?? c.CustomerName ?? '').trim();
        const tallyCustomerID = c.tallyCustomerID ?? c.TallyCustomerID ?? 0;
        const displayName = tallyCustomerID > 0 ? `${tallyCustomerID} - ${customerName}` : customerName;
        return { customerID, customerName, tallyCustomerID, displayName };
      })
      .filter((c) => c.customerID && c.customerName);
  }

  private filterCustomers(value: string): { customerID: number; customerName: string; tallyCustomerID?: number; displayName?: string }[] {
    if (!value || value.length < 2) return [];
    const filterValue = value.toLowerCase();
    return this.customerList.filter((c) =>
      c.customerName.toLowerCase().includes(filterValue)
      || String(c.tallyCustomerID || '').includes(filterValue)
      || (c.displayName || '').toLowerCase().includes(filterValue)
    );
  }

  private resolveSelectedCustomerFrom(ctrl: FormControl): { customerID: number; customerName: string } | null {
    const value = ctrl.value;
    if (!value) return null;
    if (typeof value === 'object' && value.customerID) return value;
    const name = String(value).trim().toLowerCase();
    return this.customerList.find((c) =>
      c.customerName.toLowerCase() === name || (c.displayName || '').toLowerCase() === name
    ) || null;
  }

  private buildVerifiedDutySlipCriteria(skipCount = 0): DutySlipDocumentBackfillCriteria {
    const customer = this.resolveSelectedCustomerFrom(this.verifiedCustomerCtrl);
    const dutySlipIDs = this.parseDutySlipIds(this.verifiedDutySlipIdsCtrl.value);
    const criteria: DutySlipDocumentBackfillCriteria = {
      customerID: customer?.customerID,
      maxCandidates: this.docBackfillBatchSize,
      skipCount,
      targetMode: this.verifiedTargetMode,
      documentExistsFilter: this.verifiedExistsFilter,
    };
    if (dutySlipIDs.length > 0) {
      criteria.dutySlipIDs = dutySlipIDs;
    } else {
      criteria.fromDate = this.formatApiDate(this.verifiedFromDateCtrl.value);
      criteria.toDate = this.formatApiDate(this.verifiedToDateCtrl.value);
    }
    return criteria;
  }

  private buildTollInterstateCriteria(skipCount = 0): DutySlipDocumentBackfillCriteria {
    const customer = this.resolveSelectedCustomerFrom(this.tollCustomerCtrl);
    const dutySlipIDs = this.parseDutySlipIds(this.tollDutySlipIdsCtrl.value);
    const criteria: DutySlipDocumentBackfillCriteria = {
      customerID: customer?.customerID,
      maxCandidates: this.docBackfillBatchSize,
      skipCount,
      targetMode: this.tollTargetMode,
      documentExistsFilter: this.tollExistsFilter,
    };
    if (dutySlipIDs.length > 0) {
      criteria.dutySlipIDs = dutySlipIDs;
    } else {
      criteria.fromDate = this.formatApiDate(this.tollFromDateCtrl.value);
      criteria.toDate = this.formatApiDate(this.tollToDateCtrl.value);
    }
    return criteria;
  }

  private normalizeDocBackfillCandidates(rows: any[]): DutySlipDocumentBackfillCandidateRow[] {
    return (rows || []).map((row) => ({
      dutySlipID: row?.dutySlipID ?? row?.DutySlipID,
      reservationID: row?.reservationID ?? row?.ReservationID ?? null,
      customerName: row?.customerName ?? row?.CustomerName ?? null,
      pickUpDate: row?.pickUpDate ?? row?.PickUpDate ?? null,
      status: row?.status ?? row?.Status ?? null,
      targetRelativePath: row?.targetRelativePath ?? row?.TargetRelativePath ?? null,
      hasActiveTargetDocument: row?.hasActiveTargetDocument ?? row?.HasActiveTargetDocument ?? false,
      tollParkingReceiptCount: row?.tollParkingReceiptCount ?? row?.TollParkingReceiptCount ?? 0,
      interstateReceiptCount: row?.interstateReceiptCount ?? row?.InterstateReceiptCount ?? 0,
      hasAllTollInterstateDocuments: row?.hasAllTollInterstateDocuments ?? row?.HasAllTollInterstateDocuments ?? false,
    }));
  }

  private getDocBackfillEstimatedBatchCount(preview: DutySlipDocumentBackfillPreviewResult | null, batchSize: number): number {
    const fromPreview = preview?.estimatedBatchCount ?? preview?.EstimatedBatchCount;
    if (fromPreview && fromPreview > 0) return fromPreview;
    const total = preview?.totalMatchedCount ?? preview?.TotalMatchedCount ?? 0;
    return total > 0 ? Math.max(1, Math.ceil(total / batchSize)) : 1;
  }

  private startVerifiedDutySlipBatch(performedBy: number): void {
    this.verifiedBatchNumber += 1;
    const criteria = this.buildVerifiedDutySlipCriteria(this.verifiedBatchSkip);
    this.service.startVerifiedDutySlipBackfillJob(criteria, performedBy).subscribe({
      next: (result) => {
        const jobId = result?.jobId ?? result?.JobId;
        if (!jobId) {
          this.verifiedBackfilling = false;
          this.snackBar.open('Backfill job did not return a job id.', 'Close', { duration: 6000 });
          return;
        }
        this.startPolling(jobId, false, false, true, false);
      },
      error: (err) => {
        this.verifiedBackfilling = false;
        this.verifiedBackfillLoadError = this.extractError(err, 'Failed to start verified duty slip backfill.');
        this.snackBar.open(this.verifiedBackfillLoadError, 'Close', { duration: 8000 });
      },
    });
  }

  private startTollInterstateBatch(performedBy: number): void {
    this.tollBatchNumber += 1;
    const criteria = this.buildTollInterstateCriteria(this.tollBatchSkip);
    this.service.startTollInterstateBackfillJob(criteria, performedBy).subscribe({
      next: (result) => {
        const jobId = result?.jobId ?? result?.JobId;
        if (!jobId) {
          this.tollBackfilling = false;
          this.snackBar.open('Backfill job did not return a job id.', 'Close', { duration: 6000 });
          return;
        }
        this.startPolling(jobId, false, false, false, true);
      },
      error: (err) => {
        this.tollBackfilling = false;
        this.tollBackfillLoadError = this.extractError(err, 'Failed to start toll/interstate backfill.');
        this.snackBar.open(this.tollBackfillLoadError, 'Close', { duration: 8000 });
      },
    });
  }

  private mergeDocBackfillProgress(errorRows: any[], kind: 'verified' | 'toll'): void {
    const sortedLogs = (errorRows || [])
      .map((row) => this.normalizeErrorRow(row))
      .sort((a, b) => {
        const ta = a.uploadTimestamp ? new Date(a.uploadTimestamp).getTime() : 0;
        const tb = b.uploadTimestamp ? new Date(b.uploadTimestamp).getTime() : 0;
        return ta - tb;
      });

    const rows = sortedLogs.map((log) => {
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

    const total = this.activeJob?.totalFiles ?? this.activeJob?.TotalFiles ?? rows.length;
    const isRunning = this.getJobStatus() === 'Processing' || this.getJobStatus() === 'Pending';
    const progressRows = isRunning && rows.length < total
      ? [
          ...rows,
          {
            dutySlipID: 0,
            originalFile: '',
            status: 'Processing' as ClosingDutySlipBackfillProgressStatus,
            processingType: '',
            details: 'Processing next record...',
            completedAt: null,
          },
        ]
      : rows;

    if (kind === 'verified') {
      this.verifiedBackfillProgressRows = progressRows;
    } else {
      this.tollBackfillProgressRows = progressRows;
    }
  }

  private getDocBackfillBatchProgressLabel(
    backfilling: boolean,
    isJob: boolean,
    batchNumber: number,
    totalBatches: number
  ): string {
    if (!backfilling && !isJob) {
      return '';
    }
    if (totalBatches <= 1) {
      return '';
    }
    return `Batch ${batchNumber} of ${totalBatches}`;
  }

  private formatDocBackfillElapsedTime(startedAt: number | null): string {
    if (!startedAt) return '—';
    const elapsedMs = Date.now() - startedAt;
    const seconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remSeconds}s` : `${seconds}s`;
  }

  private getDocBackfillRemainingCount(): number {
    const total = this.activeJob?.totalFiles ?? this.activeJob?.TotalFiles ?? 0;
    const processed = this.activeJob?.processedFiles ?? this.activeJob?.ProcessedFiles ?? 0;
    return Math.max(0, total - processed);
  }

  private getDocBackfillSkippedCount(rows: ClosingDutySlipBackfillProgressRow[]): number {
    return rows.filter((row) => row.status === 'Skipped').length;
  }

  private getDocBackfillCurrentRecordLabel(rows: ClosingDutySlipBackfillProgressRow[]): string {
    if (!rows.length) return '—';
    const last = rows[rows.length - 1];
    if (last.status === 'Processing' && rows.length > 1) {
      const previous = rows[rows.length - 2];
      return `${previous.dutySlipID} (${previous.originalFile || 'n/a'})`;
    }
    return `${last.dutySlipID} (${last.originalFile || 'n/a'})`;
  }

  private onDocBackfillBatchJobFinished(kind: 'verified' | 'toll', errors: any[]): void {
    this.mergeDocBackfillProgress(errors || [], kind);
    const status = this.getJobStatus();
    if (status === 'Failed') {
      if (kind === 'verified') {
        this.verifiedBackfilling = false;
        this.verifiedRunAllBatches = false;
      } else {
        this.tollBackfilling = false;
        this.tollRunAllBatches = false;
      }
      this.snackBar.open('Batch failed. Remaining batches were not started.', 'Close', { duration: 8000 });
      return;
    }

    const processedThisBatch = this.activeJob?.processedFiles ?? this.activeJob?.ProcessedFiles ?? 0;
    if (kind === 'verified') {
      this.verifiedAllBatchesProcessed += processedThisBatch;
      this.verifiedBatchSkip += processedThisBatch;
      const totalMatched = this.verifiedBackfillPreview?.totalMatchedCount ?? this.verifiedBackfillPreview?.TotalMatchedCount ?? 0;
      if (this.verifiedRunAllBatches && this.verifiedBatchSkip < totalMatched) {
        const performedBy = this.generalService.getUserID();
        if (performedBy) {
          this.snackBar.open(
            `Batch ${this.verifiedBatchNumber} of ${this.verifiedTotalBatches} finished. Starting next batch...`,
            'Close',
            { duration: 5000 }
          );
          setTimeout(() => this.startVerifiedDutySlipBatch(performedBy), 1500);
          return;
        }
      }
      this.verifiedBackfilling = false;
      this.verifiedRunAllBatches = false;
      if (this.verifiedTotalBatches > 1) {
        this.snackBar.open(
          `All ${this.verifiedTotalBatches} batch(es) completed (${this.verifiedAllBatchesProcessed} duty slip(s) processed).`,
          'Close',
          { duration: 10000 }
        );
      }
    } else {
      this.tollAllBatchesProcessed += processedThisBatch;
      this.tollBatchSkip += processedThisBatch;
      const totalMatched = this.tollBackfillPreview?.totalMatchedCount ?? this.tollBackfillPreview?.TotalMatchedCount ?? 0;
      if (this.tollRunAllBatches && this.tollBatchSkip < totalMatched) {
        const performedBy = this.generalService.getUserID();
        if (performedBy) {
          this.snackBar.open(
            `Batch ${this.tollBatchNumber} of ${this.tollTotalBatches} finished. Starting next batch...`,
            'Close',
            { duration: 5000 }
          );
          setTimeout(() => this.startTollInterstateBatch(performedBy), 1500);
          return;
        }
      }
      this.tollBackfilling = false;
      this.tollRunAllBatches = false;
      if (this.tollTotalBatches > 1) {
        this.snackBar.open(
          `All ${this.tollTotalBatches} batch(es) completed (${this.tollAllBatchesProcessed} duty slip(s) processed).`,
          'Close',
          { duration: 10000 }
        );
      }
    }
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
