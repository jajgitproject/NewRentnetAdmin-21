// @ts-nocheck
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import moment from 'moment';
import { GeneralService } from '../general/general.service';
import { SendDataToMyfService } from './sendDataToMyf.service';
import { SendDataToMyfRow } from './sendDataToMyf.model';
import { MyfPayloadDialogComponent } from './myf-payload-dialog.component';

function myfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
}

function myfDate(iso: string): Date {
  const parts = String(iso || '').split('-');
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  if (!year || !month || !day) {
    return myfToday();
  }
  return new Date(year, month - 1, day, 12, 0, 0);
}

@Component({
  standalone: false,
  selector: 'app-send-data-to-myf',
  templateUrl: './sendDataToMyf.component.html',
  styleUrls: ['./sendDataToMyf.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class SendDataToMyfComponent implements OnInit, OnDestroy {
  displayedColumns = [
    'select',
    'dutySlipID',
    'reservationID',
    'pickupDate',
    'myfStatus',
    'gTrackStatus',
    'myfPayload',
    'gTrackPayload'
  ];

  dataSource: SendDataToMyfRow[] = [];
  selection = new SelectionModel<SendDataToMyfRow>(true, []);
  loading = false;
  sending = false;
  totalCount = 0;
  pageNumber = 0;
  sortType = 'Ascending';
  orderByColumn = 'DutySlipID';
  batchSizeOptions = [50, 100, 200, 300, 500];
  batchSizeChoice: number | string = 100;
  recordsPerBatch = 100;
  hasSearched = false;
  searchFromDate: Date = myfToday();
  searchToDate: Date = myfToday();
  searchDutySlip = '';
  searchReservation = '';
  searchMyfStatus = 'All';
  searchGTrackStatus = 'All';
  statusOptions = ['All', 'Unprocessed', 'Successful', 'Failed', 'Processing'];
  sendSummary = '';
  batchStatus = { successful: 0, failed: 0, pending: 0, running: false };
  private batchIds: number[] = [];
  private pollTimer: any;
  private readonly pageStateKey = 'sendDataToMyf.pageState';

  constructor(
    private sendDataToMyfService: SendDataToMyfService,
    private generalService: GeneralService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.restoreSearch();
    this.sendDataToMyfService.active().subscribe({
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
  }

  searchData(): void {
    this.pageNumber = 0;
    this.loadData();
  }

  refresh(): void {
    this.pageNumber = 0;
    this.searchDutySlip = '';
    this.searchReservation = '';
    this.searchMyfStatus = 'All';
    this.searchGTrackStatus = 'All';
    this.searchFromDate = myfToday();
    this.searchToDate = myfToday();
    this.sendSummary = '';
    this.loadData();
  }

  loadData(): void {
    this.applyDefaultDates();
    const fromDate = this.formatDate(this.searchFromDate);
    const toDate = this.formatDate(this.searchToDate);
    this.loading = true;
    this.sendDataToMyfService.search(
      fromDate,
      toDate,
      this.searchDutySlip,
      this.searchReservation,
      this.searchMyfStatus,
      this.searchGTrackStatus,
      this.pageNumber,
      this.orderByColumn,
      this.sortType,
      this.pageSize()
    ).subscribe({
      next: (data) => {
        this.loading = false;
        this.hasSearched = true;
        const rows = data?.rows || data?.Rows || [];
        this.dataSource = rows.map((row) => new SendDataToMyfRow(row));
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

  selectableRows(): SendDataToMyfRow[] {
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

  private reloadForPageSize(): void {
    if (!this.hasSearched) {
      return;
    }
    this.pageNumber = 0;
    this.loadData();
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
      'Get GTrack, then send tracking for ' + selected.length + ' duty slip(s) in ' + batches + ' batch(es) of up to ' + size + '?\n\n' +
      'GTrack is fetched first. Only those tracking points are sent to MYF. Processing runs in the background. Duties that already have an invoice number are skipped.'
    );
    if (!confirmed) {
      return;
    }
    this.sending = true;
    this.sendDataToMyfService.start(
      selected.map((row) => row.dutySlipID),
      size,
      this.generalService.getUserID()
    ).subscribe({
      next: (response) => {
        this.sending = false;
        const ids = response?.myfSendBatchIds || response?.MyfSendBatchIds || [];
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
        this.notify(this.errorMessage(err, 'MYF batch could not be started.'), true);
      }
    });
  }

  openPayload(row: SendDataToMyfRow, channel: string, kind: string): void {
    this.dialog.open(MyfPayloadDialogComponent, {
      data: {
        dutySlipId: row.dutySlipID,
        channel: channel === 'gtrack' ? 'GTrack' : 'MYF',
        kind: kind === 'response' ? 'Response' : 'Request',
        loader: this.sendDataToMyfService.payload(row.dutySlipID, channel, kind)
      },
      width: '920px',
      maxWidth: '94vw',
      autoFocus: false
    });
  }

  statusClass(status: string): string {
    const key = String(status || '').toLowerCase();
    if (key === 'successful') {
      return 'is-success';
    }
    if (key === 'failed') {
      return 'is-failed';
    }
    if (key === 'processing') {
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

  private pollStatus(): void {
    this.stopPoll();
    const tick = () => {
      if (!this.batchIds.length) {
        return;
      }
      this.sendDataToMyfService.batchStatus(this.batchIds).subscribe({
        next: (status) => {
          this.applyBatchStatus(status);
          if (this.batchStatus.pending > 0) {
            this.pollTimer = setTimeout(tick, 4000);
          } else {
            this.loadData();
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
        searchMyfStatus: this.searchMyfStatus,
        searchGTrackStatus: this.searchGTrackStatus,
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
      const monthStart = moment().startOf('month').format('YYYY-MM-DD');
      const from = this.formatDate(saved.searchFromDate);
      const to = this.formatDate(saved.searchToDate);
      if (!from || !to || (from === monthStart && to === monthStart)) {
        this.searchFromDate = myfToday();
        this.searchToDate = myfToday();
      } else {
        this.searchFromDate = myfDate(from);
        this.searchToDate = myfDate(to);
      }
      this.searchDutySlip = saved.searchDutySlip || '';
      this.searchReservation = saved.searchReservation || '';
      this.searchMyfStatus = saved.searchMyfStatus || 'All';
      this.searchGTrackStatus = saved.searchGTrackStatus || 'All';
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

  private applyDefaultDates(): void {
    if (!this.searchFromDate) {
      this.searchFromDate = myfToday();
    }
    if (!this.searchToDate) {
      this.searchToDate = myfToday();
    }
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
    if (/Invalid object name 'dbo\.MyfSendBatch/i.test(firstLine)) {
      return 'MYF batch tables are missing. Restart the API, then try again.';
    }
    return firstLine || fallback;
  }
}
