// @ts-nocheck
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralService } from '../general/general.service';
import { SearchCriteria } from './creditNoteMis.model';
import { CreditNoteMisService } from './creditNoteMis.service';
import { extractExportErrorMessage, exportJobAcceptedSnackbarMessage, exportSearchButtonLabel, formatExportElapsedTime, IN_FLIGHT_EXPORT_MESSAGE, isExportJobCancelled, isExportJobNotFoundError, loadPersistedExportJobId, markExportDumpStarted, persistExportJobId } from '../general/export-job.helper';
import { StoredMisExportsComponent } from '../general/stored-mis-exports.component';
import { CustomerDropDown } from '../customer/customerDropDown.model';
import { OrganizationalEntityDropDown } from '../organizationalEntity/organizationalEntityDropDown.model';

@Component({
  standalone: false,
  selector: 'app-credit-note-mis',
  templateUrl: './creditNoteMis.component.html',
  styleUrls: ['./creditNoteMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class CreditNoteMisComponent implements OnInit, OnDestroy {
  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  private readonly exportJobPageKey = 'creditNoteMis';
  @ViewChild(StoredMisExportsComponent) storedExports?: StoredMisExportsComponent;
  readonly maxCreditNoteDateRangeDays = 15;

  customer: FormControl = new FormControl();
  branch: FormControl = new FormControl();

  searchCreditNoteNumber = '';
  searchBillNo = '';
  searchApprovalStatus = '';
  searchFromDate = '';
  searchToDate = '';

  CustomerList: CustomerDropDown[] = [];
  OrganizationalEntityList: OrganizationalEntityDropDown[] = [];

  filteredCustomerOptions: Observable<CustomerDropDown[]>;
  filteredBranchOptions: Observable<OrganizationalEntityDropDown[]>;

  constructor(
    private snackBar: MatSnackBar,
    public generalService: GeneralService,
    public creditNoteMisService: CreditNoteMisService
  ) {}

  ngOnInit() {
    this.initCustomer();
    this.initBranch();
    this.resumeExportJobIfNeeded();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }

  refresh() {
    this.clearExportJob();
    this.customer.setValue('');
    this.branch.setValue('');
    this.searchCreditNoteNumber = '';
    this.searchBillNo = '';
    this.searchApprovalStatus = '';
    this.searchFromDate = '';
    this.searchToDate = '';
  }

  buildSearchCriteria(): SearchCriteria {
    return {
      UserID: this.generalService.getUserID(),
      ShowAllLocation: this.generalService.getShowAllLocation(),
      SearchFromDate: this.searchFromDate !== '' ? moment(this.searchFromDate).format('MMM DD yyyy') : '',
      SearchToDate: this.searchToDate !== '' ? moment(this.searchToDate).format('MMM DD yyyy') : '',
      SearchCreditNoteNumber: this.searchCreditNoteNumber || '',
      SearchBillNo: this.searchBillNo || '',
      SearchCustomer: this.customer?.value || '',
      SearchBranch: this.branch?.value || '',
      SearchApprovalStatus: this.searchApprovalStatus || ''
    };
  }

  SearchData() {
    if (this.exportJobRunning) {
      this.showNotification('snackbar-danger', IN_FLIGHT_EXPORT_MESSAGE, 'bottom', 'center');
      return;
    }

    const dateRangeError = this.validateCreditNoteDateRange();
    if (dateRangeError) {
      this.showNotification('snackbar-danger', dateRangeError, 'bottom', 'center');
      return;
    }

    this.exportJobError = '';
    const searchCriteria = this.buildSearchCriteria();

    this.exportJobRunning = true;

    this.creditNoteMisService.startExportJob(searchCriteria).subscribe(
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
        this.startExportPolling(jobId);
        this.showNotification(
          'snackbar-info',
          exportJobAcceptedSnackbarMessage(startResult),
          'bottom',
          'center'
        );
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error, 'Could not start export');
        this.showNotification('snackbar-danger', this.exportJobError, 'bottom', 'center');
      }
    );
  }

  downloadExportCsv() {
    if (!this.exportJobId || !this.creditNoteMisService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.creditNoteMisService.downloadExportJob(this.exportJobId).subscribe(
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

  cancelExportJob() {
    if (!this.exportJobId || !this.isExportJobInProgress()) {
      return;
    }

    this.creditNoteMisService.cancelExportJob(this.exportJobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobRunning = false;
        this.stopExportPolling();
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
      this.creditNoteMisService.isExportJobReady(this.exportJobStatus) &&
      !this.exportJobDownloading
    );
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.creditNoteMisService.isExportJobRunning(this.exportJobStatus);
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

  getExportElapsedTime(): string {
    return formatExportElapsedTime(this.exportJobStartedAt, this.exportJobStatus);
  }

  getExportSearchButtonLabel(): string {
    return exportSearchButtonLabel(this.exportJobStatus, this.isExportJobInProgress());
  }

  validateCreditNoteDateRange(): string | null {
    if (!this.searchFromDate || !this.searchToDate) {
      return 'Credit Note Date range is required. Please select From and To dates.';
    }

    const fromDate = moment(this.searchFromDate).startOf('day');
    const toDate = moment(this.searchToDate).startOf('day');
    if (!fromDate.isValid() || !toDate.isValid()) {
      return 'Please enter valid credit note dates.';
    }
    if (toDate.isBefore(fromDate)) {
      return 'Credit Note Date To cannot be earlier than From Date.';
    }
    if (!this.hasAdditionalSearchFilters()) {
      const inclusiveDays = toDate.diff(fromDate, 'days') + 1;
      if (inclusiveDays > this.maxCreditNoteDateRangeDays) {
        return `Credit Note Date range cannot exceed ${this.maxCreditNoteDateRangeDays} days when no other search filters are selected. Add another filter to search a wider range.`;
      }
    }

    return null;
  }

  hasAdditionalSearchFilters(): boolean {
    return (
      this.isSearchValueSet(this.searchCreditNoteNumber) ||
      this.isSearchValueSet(this.searchBillNo) ||
      this.isSearchValueSet(this.customer?.value) ||
      this.isSearchValueSet(this.branch?.value) ||
      this.isSearchValueSet(this.searchApprovalStatus)
    );
  }

  private isSearchValueSet(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    const text = String(value).trim();
    return text !== '' && text.toLowerCase() !== 'null' && text.toLowerCase() !== 'all';
  }

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.creditNoteMisService.pollExportJob(jobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, status);
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
            status?.message ?? `Export ready (${rows} rows). Click Download CSV.`,
            'bottom',
            'center'
          );
          this.stopExportPolling();
          this.storedExports?.refresh();
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

  private stopExportPolling() {
    if (this.exportPollSub) {
      this.exportPollSub.unsubscribe();
      this.exportPollSub = undefined;
    }
  }

  private resumeExportJobIfNeeded() {
    const jobId = loadPersistedExportJobId(this.exportJobPageKey);
    if (!jobId) {
      return;
    }

    this.exportJobId = jobId;
    if (!this.exportJobStatus) {
      this.exportJobStatus = { status: 'Pending', message: 'Checking export status...' };
    }

    this.creditNoteMisService.getExportJobStatus(jobId).subscribe(
      (status: any) => {
        if (!status) {
          this.exportJobRunning = true;
          this.startExportPolling(jobId);
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = status;
        this.exportJobError = '';
        if (this.creditNoteMisService.isExportJobRunning(status)) {
          this.exportJobRunning = true;
          this.exportJobStartedAt = markExportDumpStarted(this.exportJobStartedAt, this.exportJobStatus);
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

  private clearExportJob() {
    this.stopExportPolling();
    this.exportJobId = null;
    this.exportJobStatus = null;
    this.exportJobRunning = false;
    this.exportJobDownloading = false;
    this.exportJobError = '';
    this.exportJobStartedAt = null;
  }

  private triggerCsvDownload(blob: Blob, preferredFileName?: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timeStamp = moment().format('YYYYMMDD_HHmmss');
    link.href = url;
    link.download = preferredFileName || `CreditNoteMIS_${timeStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    this.showNotification('snackbar-success', 'CSV downloaded', 'bottom', 'center');
  }

  private showNotification(colorName: string, text: string, verticalPosition: string, horizontalPosition: string) {
    this.snackBar.open(text, 'Close', {
      duration: 4000,
      verticalPosition,
      horizontalPosition,
      panelClass: colorName
    });
  }

  private initCustomer() {
    this.generalService.getCustomers().subscribe((data) => {
      this.CustomerList = data || [];
      this.filteredCustomerOptions = this.customer.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.CustomerList, value, 'customerName'))
      );
    });
  }

  private initBranch() {
    this.generalService.GetOrganizationalBranch().subscribe((data) => {
      this.OrganizationalEntityList = data || [];
      this.filteredBranchOptions = this.branch.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterList(this.OrganizationalEntityList, value, 'organizationalEntityName'))
      );
    });
  }

  private filterList(list: any[], value: string, field: string): any[] {
    const filterValue = String(value || '').toLowerCase();
    if (!list) {
      return [];
    }
    if (!filterValue) {
      return list.slice(0, 50);
    }
    return list.filter((item) => String(item[field] || '').toLowerCase().includes(filterValue)).slice(0, 50);
  }
}
