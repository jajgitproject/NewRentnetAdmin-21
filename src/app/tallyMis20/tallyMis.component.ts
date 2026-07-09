// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { MISTALLY_API_COLUMNS, MISTALLY_COLUMN_ALIASES } from './tallyMis.model';
import { TallyMis20Service } from './tallyMis.service';

export interface TallyMis20TableColumn {
  id: string;
  key: string;
}

@Component({
  standalone: false,
  selector: 'app-tallyMis20',
  templateUrl: './tallyMis.component.html',
  styleUrls: ['./tallyMis.component.sass'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class TallyMis20Component implements OnInit {
  tableColumns: TallyMis20TableColumn[] = [];
  columnWidths: Record<string, number> = {};
  dataSource: Record<string, string>[] | null = null;
  totalRecords = 0;
  pageNumber: number = 0;
  recordsPerPage = 50;
  sortType: string = 'Ascending';
  sortColumn: string = 'InvoiceID';
  csvExporting: boolean = false;

  searchFromDate: string = '';
  searchToDate: string = '';
  customerName: FormControl = new FormControl('');
  invoiceNumberWithPrefix: FormControl = new FormControl('');
  branchName: FormControl = new FormControl('');

  branchList: any[] = [];
  customerList: { customerID: number; customerName: string }[] = [];
  filteredCustomerOptions: Observable<{ customerID: number; customerName: string }[]>;
  filteredBranchOptions: Observable<any[]>;

  constructor(
    public tallyMisService: TallyMis20Service,
    public _generalService: GeneralService
  ) { }

  ngOnInit() {
    this.initTableColumns();
    this.initBranch();
    this.initCustomerAutocomplete();
    this.initInvoiceNumberInput();
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

    for (const key of MISTALLY_API_COLUMNS) {
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

  /** UI and API route use hyphen; invoice table stores slash. */
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
    this.tableColumns = MISTALLY_API_COLUMNS.map((key, index) => ({
      id: `col_${index}`,
      key
    }));
  }

  private resolveSeriesFromBillno(billno: string): string {
    const trimmed = (billno || '').trim();
    return trimmed.length <= 3 ? trimmed : trimmed.substring(0, 3);
  }

  private pickField(row: Record<string, unknown>, columnKey: string): string {
    const aliases = MISTALLY_COLUMN_ALIASES[columnKey] || [columnKey];
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
    for (const key of MISTALLY_API_COLUMNS) {
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

  loadData() {
    const fromDate = this.formatDate(this.searchFromDate);
    const toDate = this.formatDate(this.searchToDate);
    const customer = this.getCustomerSearchValue();
    const invoiceNo = this.getInvoiceSearchValue();
    const branch = this.branchName.value || '';

    this.tallyMisService
      .getTableData(fromDate, toDate, customer, invoiceNo, branch, this.pageNumber, this.sortColumn, this.sortType)
      .subscribe(
        (data) => {
          const rows = this.extractRows(data);
          this.totalRecords = this.extractTotalRecords(data, rows.length);
          this.dataSource = rows.map(row => this.normalizeRow(row));
          this.updateColumnWidths(this.dataSource);
        },
        (_error: HttpErrorResponse) => {
          this.dataSource = [];
          this.totalRecords = 0;
          this.columnWidths = {};
        }
      );
  }

  private extractRows(data: any): Record<string, unknown>[] {
    if (Array.isArray(data)) {
      return data;
    }
    return data?.rows ?? data?.Rows ?? [];
  }

  private extractTotalRecords(data: any, rowCount: number): number {
    if (Array.isArray(data)) {
      return rowCount;
    }
    return data?.totalRecords ?? data?.TotalRecords ?? rowCount;
  }

  onChangedPage(pageData: PageEvent) {
    this.pageNumber = pageData.pageIndex;
    this.recordsPerPage = pageData.pageSize;
    this.loadData();
  }

  searchData() {
    this.pageNumber = 0;
    this.dataSource = [];
    this.loadData();
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
  }

  sortingDataChanged(column: any) {
    if (this.sortColumn === column.active) {
      this.sortType = this.sortType === 'Ascending' ? 'Descending' : 'Ascending';
    } else {
      this.sortColumn = column.active;
      this.sortType = 'Ascending';
    }
    this.pageNumber = 0;
    this.loadData();
  }

  downloadCsv() {
    const fromDate = this.formatDate(this.searchFromDate);
    const toDate = this.formatDate(this.searchToDate);
    const customer = this.getCustomerSearchValue();
    const invoiceNo = this.getInvoiceSearchValue();
    const branch = this.branchName.value || '';

    this.csvExporting = true;
    this.tallyMisService.downloadCsv(fromDate, toDate, customer, invoiceNo, branch).subscribe(
      (blob: Blob) => {
        this.csvExporting = false;
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `TallyMIS20_${moment().format('YYYYMMDD_HHmmss')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(fileUrl);
      },
      () => {
        this.csvExporting = false;
      }
    );
  }
}
