// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { extractExportErrorMessage } from '../general/export-job.helper';
import { DYNAMICS_MIS_API_COLUMNS, DYNAMICS_MIS_COLUMN_ALIASES } from './dynamicsMis.model';
import { DynamicsMis20Service } from './dynamicsMis.service';

export interface DynamicsMis20TableColumn {
  id: string;
  key: string;
}

@Component({
  standalone: false,
  selector: 'app-dynamicsMis20',
  templateUrl: './dynamicsMis.component.html',
  styleUrls: ['./dynamicsMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class DynamicsMis20Component implements OnInit, OnDestroy {
  tableColumns: DynamicsMis20TableColumn[] = [];
  columnWidths: Record<string, number> = {};
  dataSource: Record<string, string>[] | null = null;
  totalRecords = 0;
  pageNumber: number = 0;
  recordsPerPage = 50;
  sortType: string = 'Ascending';
  sortColumn: string = 'InvoiceID';

  searchFromDate: string = '';
  searchToDate: string = '';
  customerName: FormControl = new FormControl('');
  invoiceNumberWithPrefix: FormControl = new FormControl('');
  branchName: FormControl = new FormControl('');

  branchList: any[] = [];
  customerList: { customerID: number; customerName: string }[] = [];
  filteredCustomerOptions: Observable<{ customerID: number; customerName: string }[]>;
  filteredBranchOptions: Observable<any[]>;

  exportJobId: string | null = null;
  exportJobStatus: any = null;
  exportJobRunning = false;
  exportJobDownloading = false;
  exportJobError = '';
  exportJobStartedAt: number | null = null;
  private exportPollSub?: Subscription;
  readonly maxDateRangeDays = 15;
  readonly exportJobType = 'DynamicsMIS20Export';

  constructor(
    public dynamicsMisService: DynamicsMis20Service,
    public _generalService: GeneralService
  ) { }

  ngOnInit() {
    this.initTableColumns();
    this.initBranch();
    this.initCustomerAutocomplete();
    this.initInvoiceNumberInput();
  }

  ngOnDestroy() {
    this.stopExportPolling();
  }

  get displayedColumnIds(): string[] {
    return this.tableColumns.map(c => c.id);
  }

  getCellValue(row: Record<string, string>, columnKey: string): string {
    return row[columnKey] ?? '';
  }

  displayCustomerName(option: { customerName?: string } | string): string {
    if (!option) {
      return '';
    }
    if (typeof option === 'string') {
      return option;
    }
    return option.customerName || '';
  }

  getColumnWidth(columnKey: string): string {
    const width = this.columnWidths[columnKey];
    return width ? `${width}px` : 'auto';
  }

  private updateColumnWidths(rows: Record<string, string>[]) {
    const padding = 40;
    const minWidth = 72;
    const maxWidth = 520;
    const charPx = 7.5;
    const widths: Record<string, number> = {};

    for (const key of DYNAMICS_MIS_API_COLUMNS) {
      let maxLen = key.length;
      for (const row of rows) {
        maxLen = Math.max(maxLen, (row[key] || '').length);
      }
      widths[key] = Math.min(maxWidth, Math.max(minWidth, Math.ceil(maxLen * charPx + padding)));
    }

    this.columnWidths = widths;
  }

  private getCustomerSearchValue(): string {
    const value = this.customerName.value;
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return value.customerName || '';
  }

  private toInvoiceDisplayValue(value: string): string {
    return (value || '').replace(/\//g, '-');
  }

  private getInvoiceSearchValue(): string {
    const value = this.invoiceNumberWithPrefix.value;
    if (!value) {
      return '';
    }
    return this.toInvoiceDisplayValue(String(value));
  }

  private formatDate(dateValue: string): string {
    if (!dateValue) {
      return '';
    }
    return moment(dateValue).format('yyyy-MM-DD');
  }

  private initTableColumns() {
    this.tableColumns = DYNAMICS_MIS_API_COLUMNS.map((key, index) => ({
      id: `col_${index}`,
      key
    }));
  }

  private resolveSeriesFromBillno(billno: string): string {
    const trimmed = (billno || '').trim();
    return trimmed.length <= 3 ? trimmed : trimmed.substring(0, 3);
  }

  private pickField(row: Record<string, unknown>, columnKey: string): string {
    const aliases = DYNAMICS_MIS_COLUMN_ALIASES[columnKey] || [columnKey];
    for (const alias of aliases) {
      const value = row[alias];
      if (value !== undefined && value !== null) {
        return String(value);
      }
    }
    return '';
  }

  private normalizeRow(row: Record<string, unknown>): Record<string, string> {
    const normalized: Record<string, string> = {};
    for (const key of DYNAMICS_MIS_API_COLUMNS) {
      normalized[key] = this.pickField(row, key);
    }
    if (!normalized.Series) {
      normalized.Series = this.resolveSeriesFromBillno(
        normalized.Billno || this.pickField(row, 'Billno')
      );
    }
    return normalized;
  }

  private initBranch() {
    this._generalService.GetOrganizationalBranch().subscribe(data => {
      this.branchList = data || [];
      this.filteredBranchOptions = this.branchName.valueChanges.pipe(
        startWith(''),
        map(value => this.filterBranch(value || ''))
      );
    });
  }

  private filterBranch(value: string): any[] {
    if (!value || value.length < 2) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.branchList.filter(
      (x) => (x.organizationalEntityName || '').toLowerCase().includes(filterValue)
    );
  }

  private normalizeCustomerOption(customer: any): { customerID: number; customerName: string } {
    return {
      customerID: customer?.customerID ?? customer?.CustomerID ?? 0,
      customerName: (customer?.customerName ?? customer?.CustomerName ?? '').trim()
    };
  }

  private initCustomerAutocomplete() {
    this._generalService.getCustomers().subscribe(data => {
      this.customerList = (data || [])
        .map(c => this.normalizeCustomerOption(c))
        .filter(c => c.customerName);
      this.filteredCustomerOptions = this.customerName.valueChanges.pipe(
        startWith(''),
        map(value => this.filterCustomer(value || ''))
      );
    });
  }

  private filterCustomer(value: string): { customerID: number; customerName: string }[] {
    if (!value || value.length < 2) {
      return [];
    }
    const filterValue = value.toLowerCase();
    return this.customerList.filter(
      (x) => x.customerName.toLowerCase().includes(filterValue)
    );
  }

  private initInvoiceNumberInput() {
    this.invoiceNumberWithPrefix.valueChanges.subscribe(value => {
      const displayValue = this.toInvoiceDisplayValue(String(value || ''));
      if (displayValue !== value) {
        this.invoiceNumberWithPrefix.setValue(displayValue, { emitEvent: false });
      }
    });
  }

  searchData() {
    if (this.exportJobRunning) {
      return;
    }

    const dateRangeError = this.validateDateRange();
    if (dateRangeError) {
      return;
    }

    this.pageNumber = 0;
    this.dataSource = null;
    this.exportJobError = '';
    this.exportJobStartedAt = Date.now();

    const fromDate = this.formatDate(this.searchFromDate);
    const toDate = this.formatDate(this.searchToDate);
    const customer = this.getCustomerSearchValue();
    const invoiceNo = this.getInvoiceSearchValue();
    const branch = this.branchName.value || '';

    this.exportJobRunning = true;
    this.dynamicsMisService.startExportJob(fromDate, toDate, customer, invoiceNo, branch, this.sortColumn, this.sortType).subscribe(
      (startResult: any) => {
        const jobId = startResult?.jobId ?? startResult?.JobId;
        if (!jobId) {
          this.exportJobRunning = false;
          this.exportJobError = 'Could not start export job.';
          return;
        }

        this.exportJobId = jobId;
        this.exportJobStatus = {
          jobId,
          jobType: startResult?.jobType ?? startResult?.JobType ?? this.exportJobType,
          status: startResult?.status ?? startResult?.Status ?? 'Pending',
          message: startResult?.message ?? startResult?.Message ?? 'Export queued'
        };
        this.startExportPolling(jobId);
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error);
      }
    );
  }

  downloadExportCsv() {
    if (!this.exportJobId || !this.dynamicsMisService.isExportJobReady(this.exportJobStatus) || this.exportJobDownloading) {
      return;
    }

    this.exportJobDownloading = true;
    this.dynamicsMisService.downloadExportJob(this.exportJobId).subscribe(
      async (blob: Blob) => {
        this.exportJobDownloading = false;
        if (!blob || blob.size === 0) {
          return;
        }

        const fileName = this.exportJobStatus?.fileName ?? this.exportJobStatus?.FileName;
        this.triggerCsvDownload(blob, fileName);
        this.dynamicsMisService.getExportJobStatus(this.exportJobId).subscribe((status) => { this.exportJobStatus = status; }, () => {});
      },
      async () => {
        this.exportJobDownloading = false;
      }
    );
  }

  canDownloadExport(): boolean {
    return !!this.exportJobId && this.dynamicsMisService.isExportJobReady(this.exportJobStatus) && !this.exportJobDownloading;
  }

  isExportJobInProgress(): boolean {
    return this.exportJobRunning || this.dynamicsMisService.isExportJobRunning(this.exportJobStatus);
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
    if (!this.exportJobStartedAt) return '—';
    const elapsedSeconds = Math.floor((Date.now() - this.exportJobStartedAt) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  hasAdditionalFilters(): boolean {
    return !!(this.getCustomerSearchValue().trim() || this.getInvoiceSearchValue().trim() || (this.branchName.value || '').trim());
  }

  validateDateRange(): string | null {
    if (!this.searchFromDate || !this.searchToDate) {
      this.exportJobError = 'Date range is required. Please select From and To dates.';
      return this.exportJobError;
    }

    const fromDate = moment(this.searchFromDate).startOf('day');
    const toDate = moment(this.searchToDate).startOf('day');
    if (!fromDate.isValid() || !toDate.isValid()) {
      this.exportJobError = 'Please enter valid dates.';
      return this.exportJobError;
    }
    if (toDate.isBefore(fromDate)) {
      this.exportJobError = 'Date To cannot be earlier than From.';
      return this.exportJobError;
    }
    if (!this.hasAdditionalFilters()) {
      const inclusiveDays = toDate.diff(fromDate, 'days') + 1;
      if (inclusiveDays > this.maxDateRangeDays) {
        this.exportJobError = `Date range cannot exceed ${this.maxDateRangeDays} days when no other search filters are selected. Add another filter to search a wider range.`;
        return this.exportJobError;
      }
    }

    this.exportJobError = '';
    return null;
  }

  private startExportPolling(jobId: string) {
    this.stopExportPolling();
    this.exportPollSub = this.dynamicsMisService.pollExportJob(jobId).subscribe(
      (status: any) => {
        this.exportJobStatus = status;
        const current = String(status?.status ?? status?.Status ?? '').toLowerCase();
        if (current === 'failed') {
          this.exportJobRunning = false;
          this.exportJobError = status?.message ?? status?.Message ?? 'Export failed.';
          this.stopExportPolling();
          return;
        }
        if (current === 'completed') {
          this.exportJobRunning = false;
          this.stopExportPolling();
        }
      },
      async (error) => {
        this.exportJobRunning = false;
        this.exportJobError = await extractExportErrorMessage(error);
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
    const fileUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = preferredFileName || `DynamicsMIS20_${moment().format('YYYYMMDD_HHmmss')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(fileUrl);
  }

  refresh() {
    this.pageNumber = 0;
    this.sortType = 'Ascending';
    this.sortColumn = 'InvoiceID';
    this.searchFromDate = '';
    this.searchToDate = '';
    this.customerName.setValue('');
    this.invoiceNumberWithPrefix.setValue('');
    this.branchName.setValue('');
    this.dataSource = null;
    this.totalRecords = 0;
    this.columnWidths = {};
    this.clearExportJob();
  }
}
