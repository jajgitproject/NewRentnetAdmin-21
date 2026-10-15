// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { SendVendorClosingDataService } from './sendVendorClosingData.service';
import { SendVendorClosingDataRow } from './sendVendorClosingData.model';
import { VendorClosingPayloadDialogComponent } from './vendor-closing-payload-dialog.component';
import * as XLSX from 'xlsx';

function pageToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
}

function pageDate(iso: string): Date {
  const parts = String(iso || '').split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!year || !month || !day) {
    return pageToday();
  }
  return new Date(year, month - 1, day, 12, 0, 0);
}

@Component({
  standalone: false,
  selector: 'app-send-vendor-closing-data',
  templateUrl: './sendVendorClosingData.component.html',
  styleUrls: ['./sendVendorClosingData.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SendVendorClosingDataComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'select',
    'dutySlipID',
    'reservationID',
    'pickupDate',
    'customerName',
    'tallyCustomerID',
    'vendor',
    'status',
    'payload'
  ];

  dataSource: SendVendorClosingDataRow[] = [];
  selection = new SelectionModel<SendVendorClosingDataRow>(true, []);
  loading = false;
  sending = false;
  downloading = false;
  totalCount = 0;
  pageNumber = 0;
  sortType = 'Ascending';
  orderByColumn = 'DutySlipID';
  batchSizeOptions = [50, 100, 200, 300, 500];
  batchSizeChoice: number | string = 100;
  recordsPerBatch = 100;
  hasSearched = false;
  searchFromDate: Date = null;
  searchToDate: Date = null;
  searchDutySlip = '';
  searchReservation = '';
  searchVendor = 'All';
  searchStatus = 'All';
  customerSearch = '';
  customerId = 0;
  customerOptions: any[] = [];
  vendorOptions = ['All', 'MYF', 'MoveInSync'];
  statusOptions = ['All', 'Unprocessed', 'Successful', 'Failed', 'Processing'];
  sendSummary = '';
  batchStatus = { successful: 0, failed: 0, pending: 0, running: false };
  private batchIds: number[] = [];
  private pollTimer: any;
  private customerTimer: any;
  private readonly pageStateKey = 'sendVendorClosingData.pageState';

  constructor(
    private sendVendorClosingDataService: SendVendorClosingDataService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.restoreSearch();
    this.sendVendorClosingDataService.active().subscribe({
      next: (status) => {
        this.applyBatchStatus(status);
        if (this.batchStatus.pending > 0 || this.batchStatus.running) {
          if (!this.sendSummary) {
            this.sendSummary = 'Batch running';
          }
          this.pollStatus();
        }
        if (this.hasSearched) {
          this.loadData();
        }
      },
      error: () => {
        if (this.hasSearched) {
          this.loadData();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.saveSearch();
    this.stopPoll();
    if (this.customerTimer) {
      clearTimeout(this.customerTimer);
    }
  }

  searchData(): void {
    this.pageNumber = 0;
    this.loadData();
  }

  downloadExcel(): void {
    if (this.downloading) {
      return;
    }
    this.downloading = true;
    this.sendVendorClosingDataService.exportRows(
      this.formatDate(this.searchFromDate),
      this.formatDate(this.searchToDate),
      this.searchDutySlip,
      this.searchReservation,
      this.customerId,
      this.searchVendor,
      this.orderByColumn,
      this.sortType
    ).subscribe({
      next: (rows) => {
        this.downloading = false;
        const list = Array.isArray(rows) ? rows : [];
        if (!list.length) {
          this.notify('No bookings matched the form.', true);
          return;
        }
        const sheetRows = list.map((row) => ({
          'Duty Slip ID': this.cell(row, 'dutySlipID'),
          'Reservation ID': this.cell(row, 'reservationID'),
          'Pickup Date': this.cell(row, 'pickupDate'),
          Customer: this.cell(row, 'customerName'),
          Vendor: this.cell(row, 'vendor'),
          Status: this.cell(row, 'status'),
          'ECO Garage-Pickup Kms': this.cell(row, 'ecoGaragePickup'),
          'ECO Pickup-Drop Kms': this.cell(row, 'ecoPickupDrop'),
          'ECO Drop-Garage Kms': this.cell(row, 'ecoDropGarage'),
          'ECO Main Fare': this.cell(row, 'ecoMainFare'),
          'ECO Tax Amount': this.cell(row, 'ecoTaxAmount'),
          'ECO Discount Amount': this.cell(row, 'ecoDiscountAmount'),
          'MYF Garage-Pickup Kms': this.cell(row, 'myfGaragePickup'),
          'MYF Pickup-Drop Kms': this.cell(row, 'myfPickupDrop'),
          'MYF Drop-Garage Kms': this.cell(row, 'myfDropGarage'),
          'MYF Main Fare': this.cell(row, 'myfMainFare'),
          'MYF Tax Amount': this.cell(row, 'myfTaxAmount'),
          'MYF Discount Amount': this.cell(row, 'myfDiscountAmount')
        }));
        const book = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(sheetRows);
        XLSX.utils.book_append_sheet(book, sheet, 'Vendor closing');
        XLSX.writeFile(book, 'Vendor-closing-MIS.xlsx');
      },
      error: (err) => {
        this.downloading = false;
        this.notify(this.errorMessage(err, 'Excel could not be downloaded.'), true);
      }
    });
  }

  refresh(): void {
    this.pageNumber = 0;
    this.searchDutySlip = '';
    this.searchReservation = '';
    this.searchVendor = 'All';
    this.searchStatus = 'All';
    this.customerSearch = '';
    this.customerId = 0;
    this.customerOptions = [];
    this.searchFromDate = null;
    this.searchToDate = null;
    this.sendSummary = '';
    this.loadData();
  }

  onCustomerInput(value: string): void {
    const text = String(value || '');
    this.customerSearch = text;
    if (this.customerTimer) {
      clearTimeout(this.customerTimer);
    }
    const selected = this.customerOptions.find((option) => option.label === text);
    this.customerId = selected ? selected.customerID : 0;
    if (text.trim().length < 3) {
      this.customerOptions = [];
      return;
    }
    this.customerTimer = setTimeout(() => this.loadCustomers(text.trim()), 300);
  }

  selectCustomer(label: string): void {
    const option = (this.customerOptions || []).find((item) => item.label === label);
    this.customerId = option ? option.customerID : 0;
    this.customerSearch = label || '';
  }

  loadData(): void {
    this.loading = true;
    this.sendVendorClosingDataService.search(
      this.formatDate(this.searchFromDate),
      this.formatDate(this.searchToDate),
      this.searchDutySlip,
      this.searchReservation,
      this.customerId,
      this.searchVendor,
      this.searchStatus,
      this.pageNumber,
      this.orderByColumn,
      this.sortType,
      this.pageSize()
    ).subscribe({
      next: (data) => {
        this.loading = false;
        this.hasSearched = true;
        const rows = data?.rows || data?.Rows || [];
        this.dataSource = rows.map((row) => new SendVendorClosingDataRow(row));
        this.totalCount = data?.totalCount || data?.TotalCount || this.dataSource.length;
        this.selection.clear();
      },
      error: (err) => {
        this.loading = false;
        this.dataSource = [];
        this.totalCount = 0;
        this.notify(this.errorMessage(err, 'Search failed.'), true);
      }
    });
  }

  nextPage(): void {
    if ((this.pageNumber + 1) * this.pageSize() >= this.totalCount) {
      return;
    }
    this.pageNumber += 1;
    this.loadData();
  }

  previousPage(): void {
    if (this.pageNumber === 0) {
      return;
    }
    this.pageNumber -= 1;
    this.loadData();
  }

  sort(column: string): void {
    if (this.orderByColumn === column) {
      this.sortType = this.sortType === 'Ascending' ? 'Descending' : 'Ascending';
    } else {
      this.orderByColumn = column;
      this.sortType = 'Ascending';
    }
    this.pageNumber = 0;
    this.loadData();
  }

  toggleAll(): void {
    const selectable = this.selectableRows();
    if (this.allSelected()) {
      selectable.forEach((row) => this.selection.deselect(row));
      return;
    }
    selectable.forEach((row) => this.selection.select(row));
  }

  allSelected(): boolean {
    const selectable = this.selectableRows();
    return selectable.length > 0 && selectable.every((row) => this.selection.isSelected(row));
  }

  selectableRows(): SendVendorClosingDataRow[] {
    return (this.dataSource || []).filter((row) => row.canSelect);
  }

  selectedCount(): number {
    return this.selection.selected.filter((row) => row.canSelect).length;
  }

  onBatchSizeChoice(): void {
    if (this.batchSizeChoice !== 'custom') {
      this.recordsPerBatch = Number(this.batchSizeChoice);
    }
    this.clampBatchSize(false);
    this.reloadForPageSize();
  }

  clampBatchSize(reload: boolean = true): void {
    let size = Math.floor(Number(this.recordsPerBatch) || 1);
    if (size < 1) {
      size = 1;
    }
    if (size > 1000) {
      size = 1000;
    }
    this.recordsPerBatch = size;
    if (reload) {
      this.reloadForPageSize();
    }
  }

  pageSize(): number {
    return this.safeBatchSize();
  }

  pageStart(): number {
    if (!this.dataSource.length) {
      return 0;
    }
    return this.pageNumber * this.pageSize() + 1;
  }

  pageEnd(): number {
    return this.pageNumber * this.pageSize() + this.dataSource.length;
  }

  batchCount(): number {
    const selected = this.selectedCount();
    if (!selected) {
      return 0;
    }
    return Math.ceil(selected / this.safeBatchSize());
  }

  batchSplitLabel(): string {
    const selected = this.selectedCount();
    const size = this.safeBatchSize();
    if (!selected) {
      return 'Select duties to calculate batches.';
    }
    const batches = Math.ceil(selected / size);
    const remainder = selected % size;
    const full = Math.floor(selected / size);
    if (remainder === 0) {
      return selected + ' selected · ' + size + ' per batch · ' + batches + ' batch' + (batches === 1 ? '' : 'es');
    }
    const parts = [];
    for (let i = 0; i < full; i++) {
      parts.push(String(size));
    }
    parts.push(String(remainder));
    return selected + ' selected · ' + batches + ' batches (' + parts.join(' + ') + ')';
  }

  send(): void {
    this.clampBatchSize();
    const selected = this.selection.selected.filter((row) => row.canSelect && row.dutySlipID > 0);
    if (!selected.length) {
      this.notify('Select at least one duty.', true);
      return;
    }
    const size = this.safeBatchSize();
    const batches = Math.ceil(selected.length / size);
    const confirmed = window.confirm(
      'Send vendor closing data for ' + selected.length + ' duty slip(s) in ' + batches + ' batch(es) of up to ' + size + '?\n\n' +
      'MYF duties send the closed event. MoveInSync duties send end duty and invoice data. Processing continues if you leave this page.'
    );
    if (!confirmed) {
      return;
    }
    this.sending = true;
    this.sendVendorClosingDataService.start(
      selected.map((row) => row.dutySlipID),
      size,
      this.generalService.getUserID()
    ).subscribe({
      next: (response) => {
        this.sending = false;
        const ids = response?.vendorClosingBatchIds || response?.VendorClosingBatchIds || [];
        const count = response?.numberofItems || response?.NumberofItems || selected.length;
        const batchCount = response?.batchCount || response?.BatchCount || ids.length;
        this.batchIds = ids;
        this.sendSummary = response?.message || response?.Message
          || ('Started ' + batchCount + ' batch(es) for ' + count + ' duty slip(s).');
        this.notify(this.sendSummary, false);
        this.selection.clear();
        this.loadData();
        this.pollStatus();
      },
      error: (err) => {
        this.sending = false;
        this.notify(this.errorMessage(err, 'Vendor closing batch could not be started.'), true);
      }
    });
  }

  openPayload(row: SendVendorClosingDataRow): void {
    this.dialog.open(VendorClosingPayloadDialogComponent, {
      data: {
        dutySlipId: row.dutySlipID,
        vendor: row.vendor,
        loader: this.sendVendorClosingDataService.payload(row.dutySlipID)
      },
      width: '1040px',
      maxWidth: '96vw',
      autoFocus: false
    });
  }

  tallyLabel(value: number): string {
    return value > 0 ? String(value) : '';
  }

  statusClass(status: string): string {
    const key = String(status || '').toLowerCase();
    if (key === 'successful') {
      return 'is-success';
    }
    if (key === 'failed') {
      return 'is-failed';
    }
    if (key === 'processing' || key === 'queued') {
      return 'is-running';
    }
    return 'is-idle';
  }

  formatPickup(value: string): string {
    if (!value) {
      return '';
    }
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('DD-MM-YYYY') : value;
  }

  private loadCustomers(prefix: string): void {
    this.sendVendorClosingDataService.customers(prefix).subscribe({
      next: (customers) => {
        this.customerOptions = (customers || []).map((customer) => {
          const name = String(customer?.customerName || customer?.CustomerName || '').trim();
          const tally = Number(customer?.tallyCustomerID || customer?.TallyCustomerID || 0);
          return {
            customerID: customer?.customerID || customer?.CustomerID || 0,
            label: tally > 0 ? name + ' (' + tally + ')' : name
          };
        }).filter((option) => option.customerID > 0 && option.label);
      },
      error: () => {
        this.customerOptions = [];
      }
    });
  }

  private reloadForPageSize(): void {
    if (!this.hasSearched) {
      return;
    }
    this.pageNumber = 0;
    this.loadData();
  }

  private pollStatus(): void {
    this.stopPoll();
    const tick = () => {
      if (!this.batchIds.length) {
        return;
      }
      this.sendVendorClosingDataService.batchStatus(this.batchIds).subscribe({
        next: (status) => {
          this.applyBatchStatus(status);
          if (this.hasSearched) {
            this.loadData();
          }
          if (this.batchStatus.pending > 0) {
            this.pollTimer = setTimeout(tick, 4000);
          }
        },
        error: () => {
          this.pollTimer = setTimeout(tick, 6000);
        }
      });
    };
    tick();
  }

  private applyBatchStatus(status: any): void {
    const ids = status?.batchIds || status?.BatchIds;
    if (Array.isArray(ids) && ids.length) {
      this.batchIds = ids.map((id) => Number(id)).filter((id) => id > 0);
    }
    this.batchStatus = {
      successful: status?.successful || status?.Successful || 0,
      failed: status?.failed || status?.Failed || 0,
      pending: status?.pending || status?.Pending || 0,
      running: !!(status?.running || status?.Running)
    };
  }

  private saveSearch(): void {
    try {
      sessionStorage.setItem(this.pageStateKey, JSON.stringify({
        searchFromDate: this.formatDate(this.searchFromDate),
        searchToDate: this.formatDate(this.searchToDate),
        searchDutySlip: this.searchDutySlip,
        searchReservation: this.searchReservation,
        searchVendor: this.searchVendor,
        searchStatus: this.searchStatus,
        customerSearch: this.customerSearch,
        customerId: this.customerId,
        pageNumber: this.pageNumber,
        sortType: this.sortType,
        orderByColumn: this.orderByColumn,
        hasSearched: this.hasSearched
      }));
    } catch (e) {
    }
  }

  private restoreSearch(): void {
    try {
      const raw = sessionStorage.getItem(this.pageStateKey);
      if (!raw) {
        return;
      }
      const saved = JSON.parse(raw);
      if (!saved) {
        return;
      }
      const from = this.formatDate(saved.searchFromDate);
      const to = this.formatDate(saved.searchToDate);
      this.searchFromDate = from ? pageDate(from) : null;
      this.searchToDate = to ? pageDate(to) : null;
      this.searchDutySlip = saved.searchDutySlip || '';
      this.searchReservation = saved.searchReservation || '';
      this.searchVendor = saved.searchVendor || 'All';
      this.searchStatus = saved.searchStatus || 'All';
      this.customerSearch = saved.customerSearch || '';
      this.customerId = Number(saved.customerId) || 0;
      this.pageNumber = Number(saved.pageNumber) || 0;
      this.sortType = saved.sortType || 'Ascending';
      this.orderByColumn = saved.orderByColumn || 'DutySlipID';
      this.hasSearched = !!saved.hasSearched;
    } catch (e) {
    }
  }

  private stopPoll(): void {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private safeBatchSize(): number {
    let size = Math.floor(Number(this.recordsPerBatch) || 100);
    if (size < 1) {
      size = 1;
    }
    if (size > 1000) {
      size = 1000;
    }
    return size;
  }

  private cell(row: any, key: string): string {
    const pascal = key.charAt(0).toUpperCase() + key.slice(1);
    const value = row?.[key] ?? row?.[pascal];
    return value == null ? '' : String(value);
  }

  private formatDate(value: any): string {
    if (!value) {
      return '';
    }
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '';
  }

  private notify(message: string, danger: boolean): void {
    this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: danger ? ['snackbar-danger', 'myf-center-snack'] : ['snackbar-success', 'myf-center-snack']
    });
  }

  private errorMessage(err: any, fallback: string): string {
    const body = err && err.error !== undefined ? err.error : err;
    let text = '';
    if (typeof body === 'string' && body) {
      text = body;
    } else {
      text = (body && (body.message || body.Message)) || fallback;
    }
    const firstLine = String(text || fallback).split(/\r?\n/)[0].replace(/^System\.Data\.SqlClient\.SqlException[^:]*:\s*/, '').trim();
    if (/Invalid object name 'dbo\.VendorClosingBatch/i.test(firstLine)) {
      return 'Vendor closing batch tables are missing. Restart the API, then try again.';
    }
    return firstLine || fallback;
  }
}
