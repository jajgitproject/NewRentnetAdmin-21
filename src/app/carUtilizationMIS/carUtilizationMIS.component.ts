// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { debounceTime, distinctUntilChanged, of, Subscription, switchMap } from 'rxjs';
import { CarUtilizationMISService } from './carUtilizationMIS.service';
import { CarUtilizationReportCarRow, CarUtilizationReportRow } from './carUtilizationMIS.model';
import { GeneralService } from '../general/general.service';
import {
  extractExportErrorMessage,
  exportJobAcceptedSnackbarMessage,
  exportSearchButtonLabel,
  formatExportElapsedTime,
  IN_FLIGHT_EXPORT_MESSAGE,
  isExportJobCancelled,
  isExportJobNotFoundError,
  loadPersistedExportJobId,
  markExportDumpStarted,
  persistExportJobId
} from '../general/export-job.helper';

@Component({
  standalone: false,
  selector: 'app-carUtilizationMIS',
  templateUrl: './carUtilizationMIS.component.html',
  styleUrls: ['./carUtilizationMIS.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CarUtilizationMISComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  fixedColumns = ['location', 'carNo', 'carName', 'carStatus', 'modeOfCar'];
  metricColumns = ['hrs', 'kms', 'duties', 'gps', 'usage'];

  pickupDateFrom: Date | null = null;
  pickupDateTo: Date | null = null;
  carNumbers = '';
  customerNameControl = new FormControl('');
  customerOptions: any[] = [];
  dutySlipIds = '';
  reservationIds = '';

  carRecords: CarUtilizationReportCarRow[] = [];
  reportDates: Date[] = [];
  dataSource: CarUtilizationReportRow[] = [];
  totalRecords = 0;
  pageSize = 50;
  pageNumber = 0;
  loading = false;
  hasSearched = false;

  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  exportElapsedLabel = '';
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'carUtilizationMIS';

  constructor(
    private carUtilizationMISService: CarUtilizationMISService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setupCustomerAutocomplete();
    this.resetToDefaultState(false);
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy(): void {
    this.stopExportPolling();
  }

  displayCustomer(option: any): string {
    return option && typeof option === 'object' ? option.customerName : option || '';
  }

  private setupCustomerAutocomplete(): void {
    this.customerNameControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          const term = (value || '').toString().trim();
          if (term.length < 3) {
            this.customerOptions = [];
            return of([]);
          }
          return this.generalService.GetCustomerDropDownForControlPanel(term);
        })
      )
      .subscribe((list) => {
        this.customerOptions = list || [];
      });
  }

  search(): void {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    const validationMessage = this.validateDateRange();
    if (validationMessage) {
      this.showNotification('snackbar-danger', validationMessage, 'bottom', 'center');
      return;
    }

    this.pageNumber = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadData();
  }

  reset(): void {
    this.clearExportJob();
    this.resetToDefaultState(true);
  }

  startExportJob(): void {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    const validationMessage = this.validateDateRange();
    if (validationMessage) {
      this.showNotification('snackbar-danger', validationMessage, 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    this.exportJobRunning = true;

    this.carUtilizationMISService.startExportJob(this.buildSearchCriteria()).subscribe(
      (startResult: any) => {
        const jobId = startResult?.jobId ?? startResult?.JobId;
        if (!jobId) {
          this.exportJobRunning = false;
          this.exportJobError = 'Could not start export job.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          return;
        }

        this.exportJobId = jobId;
        persistExportJobId(this.exportJobPageKey, jobId);
        this.exportJobStatus = {
          jobId,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Export queued'
        };
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
        this.refreshExportElapsedLabel();
        this.startExportPolling(jobId);
        this.showNotification('snackbar-info', exportJobAcceptedSnackbarMessage(startResult), 'bottom', 'center');
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Could not start export');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv(): void {
    if (
      !this.exportJobId ||
      !this.carUtilizationMISService.isExportJobReady(this.exportJobStatus) ||
      this.exportJobDownloading
    ) {
      return;
    }

    this.exportJobDownloading = true;
    this.carUtilizationMISService.downloadExportJob(this.exportJobId).subscribe(
      async (blob: Blob) => {
        this.exportJobDownloading = false;

        if (!blob || blob.size === 0) {
          this.showNotification('snackbar-danger', 'Export file is empty or unavailable.', 'bottom', 'center');
          return;
        }

        const contentType = (blob.type || '').toLowerCase();
        if (contentType.includes('application/json') || contentType.includes('text/plain')) {
          const text = await blob.text();
          let message = 'Export file is not ready.';
          try {
            const parsed = JSON.parse(text || '{}');
            message = parsed.message || message;
          } catch {
            if (text && text.trim()) {
              message = text;
            }
          }
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
          return;
        }

        const fileName = this.exportJobStatus?.fileName ?? this.exportJobStatus?.FileName;
        this.triggerCsvDownload(blob, fileName);
      },
      async (error) => {
        this.exportJobDownloading = false;
        const message = await extractExportErrorMessage(error, 'Export download failed.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  cancelExportJob(): void {
    if (!this.exportJobId || !this.isExportJobInProgress()) {
      return;
    }

    this.carUtilizationMISService.cancelExportJob(this.exportJobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobRunning = false;
        this.stopExportPolling();
        this.refreshExportElapsedLabel();
        this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
      },
      async (error) => {
        const message = await extractExportErrorMessage(error, 'Could not cancel export.');
        this.showNotification('snackbar-danger', message, 'bottom', 'center');
      }
    );
  }

  canDownloadExport(): boolean {
    return (
      !!this.exportJobId &&
      this.carUtilizationMISService.isExportJobReady(this.exportJobStatus) &&
      !this.exportJobDownloading
    );
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.carUtilizationMISService.isExportJobRunning(this.exportJobStatus);
  }

  getExportButtonLabel(): string {
    const label = exportSearchButtonLabel(this.exportJobStatus, this.isExportJobInProgress());
    return label === 'Search' ? 'Export Excel' : label;
  }

  getExportJobStatusLabel(): string {
    return this.exportJobStatus?.status ?? this.exportJobStatus?.Status ?? '';
  }

  getExportJobMessage(): string {
    return this.exportJobStatus?.message ?? this.exportJobStatus?.Message ?? this.exportJobError ?? '';
  }

  getExportRowsExported(): number {
    return this.exportJobStatus?.rowsExported ?? this.exportJobStatus?.RowsExported ?? 0;
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.hasSearched) {
      this.loadData();
    }
  }

  loadData(): void {
    const validationMessage = this.validateDateRange();
    if (validationMessage) {
      this.showNotification('snackbar-danger', validationMessage, 'bottom', 'center');
      return;
    }

    this.loading = true;
    this.hasSearched = true;

    this.carUtilizationMISService
      .searchReport(this.buildSearchCriteria())
      .subscribe({
        next: (result) => {
          this.loading = false;
          this.totalRecords = result?.totalRecords ?? 0;
          this.pageSize = result?.pageSize ?? this.pageSize;
          this.pageNumber = result?.pageNumber ?? this.pageNumber;
          this.reportDates = (result?.reportDates ?? []).map((d) => new Date(d));
          this.carRecords = (result?.carRecords ?? []).map((row) => ({
            ...row,
            dayMetrics: row.dayMetrics ?? []
          }));
          this.dataSource = (result?.records ?? []).map((row) => new CarUtilizationReportRow(row));
        },
        error: (error: HttpErrorResponse | string) => {
          this.loading = false;
          this.carRecords = [];
          this.reportDates = [];
          this.dataSource = [];
          this.totalRecords = 0;
          const message = this.resolveErrorMessage(error, 'Could not load Car Utilization report.');
          this.showNotification('snackbar-danger', message, 'bottom', 'center');
        }
      });
  }

  private resetToDefaultState(showMessage: boolean): void {
    this.pickupDateFrom = null;
    this.pickupDateTo = null;
    this.carNumbers = '';
    this.customerNameControl.setValue('');
    this.customerOptions = [];
    this.dutySlipIds = '';
    this.reservationIds = '';
    this.carRecords = [];
    this.reportDates = [];
    this.dataSource = [];
    this.totalRecords = 0;
    this.pageNumber = 0;
    this.hasSearched = false;
    this.loading = false;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    if (showMessage) {
      this.showNotification('snackbar-success', 'Filters cleared.', 'bottom', 'center');
    }
  }

  private validateDateRange(): string | null {
    if (!this.pickupDateFrom || !this.pickupDateTo) {
      return 'Pickup Date From and Pickup Date To are required.';
    }
    const from = moment(this.pickupDateFrom).startOf('day');
    const to = moment(this.pickupDateTo).startOf('day');
    if (!from.isValid() || !to.isValid()) {
      return 'Please enter valid pickup dates.';
    }
    if (to.isBefore(from)) {
      return 'Pickup Date To cannot be earlier than Pickup Date From.';
    }
    return null;
  }

  private formatDateForApi(value: Date | null): string {
    return moment(value).format('YYYY-MM-DD');
  }

  private normalizeOptionalText(value: string): string {
    return (value || '').trim();
  }

  private extractCustomerName(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'object') {
      return (value.customerName || '').trim();
    }
    return value.toString().trim();
  }

  get isMultiDayView(): boolean {
    return this.reportDates.length > 1;
  }

  readonly metricsPerDay = 7;

  slNo(rowIndex: number): number {
    return this.pageNumber * this.pageSize + rowIndex + 1;
  }

  dayName(pickupDate: string | Date | null | undefined): string {
    if (!pickupDate) {
      return '';
    }
    return moment(pickupDate).format('dddd');
  }

  /** Usage % = ROUND(Hrs / 14, 2) as percent; Hrs is invoice-style (e.g. 5.37 → 38.00%). */
  usagePercent(hrs: number): string {
    const h = Math.round((Number(hrs) || 0) * 100) / 100;
    const roundedRatio = Math.round((h / 14) * 100) / 100;
    return `${(roundedRatio * 100).toFixed(2)}%`;
  }

  private buildSearchCriteria() {
    return {
      pickupDateFrom: this.formatDateForApi(this.pickupDateFrom),
      pickupDateTo: this.formatDateForApi(this.pickupDateTo),
      carNumbers: this.normalizeOptionalText(this.carNumbers),
      customerName: this.extractCustomerName(this.customerNameControl.value),
      dutySlipIds: this.normalizeOptionalText(this.dutySlipIds),
      reservationIds: this.normalizeOptionalText(this.reservationIds),
      pageNumber: this.pageNumber
    };
  }

  private startExportPolling(jobId: string): void {
    this.stopExportPolling();
    this.exportPollSub = this.carUtilizationMISService.pollExportJob(jobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, status);
        this.refreshExportElapsedLabel();
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();

        if (current === 'failed') {
          this.exportJobRunning = false;
          this.exportJobError = status?.message ?? status?.Message ?? 'Export failed.';
          this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (isExportJobCancelled(status)) {
          this.exportJobRunning = false;
          this.showNotification('snackbar-info', status?.message ?? status?.Message ?? 'Export cancelled.', 'bottom', 'center');
          this.stopExportPolling();
          persistExportJobId(this.exportJobPageKey, null);
          return;
        }

        if (current === 'completed') {
          this.exportJobRunning = false;
          const rows = status?.rowsExported ?? status?.RowsExported ?? 0;
          this.showNotification(
            'snackbar-success',
            status?.message ?? `Export ready (${rows} rows). Click Download Excel.`,
            'bottom',
            'center'
          );
          this.stopExportPolling();
        }
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Export failed.');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
        this.stopExportPolling();
      }
    );
  }

  private stopExportPolling(): void {
    if (this.exportPollSub) {
      this.exportPollSub.unsubscribe();
      this.exportPollSub = undefined;
    }
  }

  private resumeExportJobIfNeeded(): void {
    const jobId = loadPersistedExportJobId(this.exportJobPageKey);
    if (!jobId) {
      return;
    }

    this.exportJobId = jobId;
    this.carUtilizationMISService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobStatus = status;
        if (this.carUtilizationMISService.isExportJobRunning(status)) {
          this.exportJobRunning = true;
          this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, status);
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobRunning = false;
      },
      (error) => {
        if (isExportJobNotFoundError(error)) {
          persistExportJobId(this.exportJobPageKey, null);
          this.exportJobId = null;
          this.exportJobStatus = null;
          this.exportJobRunning = false;
          return;
        }

        this.exportJobRunning = true;
        this.startExportPolling(jobId);
      }
    );
  }

  private clearExportJob(): void {
    this.stopExportPolling();
    persistExportJobId(this.exportJobPageKey, null);
    this.exportJobId = null;
    this.exportJobStatus = null;
    this.exportJobRunning = false;
    this.exportJobDownloading = false;
    this.exportJobError = '';
    this.exportJobStartedAt = null;
    this.exportElapsedLabel = '';
  }

  private refreshExportElapsedLabel(): void {
    this.exportElapsedLabel = formatExportElapsedTime(this.exportJobStartedAt, this.exportJobStatus);
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `CarUtilizationMIS_${timeStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'File downloaded (open in Excel).', 'bottom', 'center');
  }

  private resolveErrorMessage(error: HttpErrorResponse | string, fallback: string): string {
    if (typeof error === 'string' && error.trim()) {
      return error.trim();
    }
    const body = (error as HttpErrorResponse)?.error;
    if (typeof body === 'string' && body.trim()) {
      return body.trim();
    }
    if (body && typeof body === 'object') {
      const msg = body.message ?? body.Message;
      if (typeof msg === 'string' && msg.trim()) {
        return msg.trim();
      }
    }
    return fallback;
  }

  showNotification(colorName: string, text: string, placementFrom: string, placementAlign: string): void {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName
    });
  }
}
