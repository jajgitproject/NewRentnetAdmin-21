import { Component, Input, OnInit } from '@angular/core';
import { DriverAppLogDetail, DriverAppLogRow, DriverAppTransactionLogService } from './driverAppTransactionLog.service';

@Component({
  standalone: false,
  selector: 'app-driver-app-transaction-log',
  templateUrl: './driverAppTransactionLog.component.html',
  styleUrls: ['./driverAppTransactionLog.component.sass']
})
export class DriverAppTransactionLogComponent implements OnInit {
  @Input() kind: 'billing' | 'api' = 'billing';
  @Input() title = 'Driver App Log';
  @Input() crumb = 'Driver App Log';

  readonly pageSize = 25;
  readonly billingEvents = [
    { value: '', label: 'All events' },
    { value: 'AppBilling', label: 'App Billing' },
    { value: 'CCAvenueDynamicQR', label: 'CCAvenue QR' },
    { value: 'CCAvenueCallback', label: 'CCAvenue Callback' }
  ];
  readonly columns = ['requestedAt', 'eventName', 'httpMethod', 'dutySlipID', 'reservationID', 'driverID', 'httpStatusCode', 'apiStatus', 'errorMessage'];

  filtersCollapsed = false;
  loading = false;
  loadError = false;
  fromDate: Date = new Date();
  toDate: Date = new Date();
  status = 'All';
  eventName = '';
  dutySlipId = '';
  reservationId = '';
  driverId = '';
  page = 1;
  totalCount = 0;
  rows: DriverAppLogRow[] = [];

  drawerOpen = false;
  detailLoading = false;
  detailError = false;
  detail: DriverAppLogDetail | null = null;
  showToken = false;
  showHeaders = false;

  constructor(private logService: DriverAppTransactionLogService) {}

  ngOnInit() {
    this.search();
  }

  toggleFilters() {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  search() {
    this.page = 1;
    this.load();
  }

  reset() {
    const today = new Date();
    this.fromDate = today;
    this.toDate = today;
    this.status = 'All';
    this.eventName = '';
    this.dutySlipId = '';
    this.reservationId = '';
    this.driverId = '';
    this.search();
  }

  previous() {
    if (this.page <= 1 || this.loading) {
      return;
    }
    this.page -= 1;
    this.load();
  }

  next() {
    if (!this.hasNext || this.loading) {
      return;
    }
    this.page += 1;
    this.load();
  }

  get hasNext(): boolean {
    return this.page * this.pageSize < this.totalCount;
  }

  get rangeLabel(): string {
    if (!this.totalCount) {
      return 'Logs: 0';
    }
    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.totalCount);
    return 'Showing ' + start + '–' + end + ' of ' + this.totalCount;
  }

  open(row: DriverAppLogRow) {
    this.drawerOpen = true;
    this.detail = null;
    this.detailError = false;
    this.detailLoading = true;
    this.showToken = false;
    this.showHeaders = false;
    this.logService.get(this.kind, row.logID).subscribe(
      (detail) => {
        this.detail = detail;
        this.detailLoading = false;
      },
      () => {
        this.detailLoading = false;
        this.detailError = true;
      }
    );
  }

  closeDrawer() {
    this.drawerOpen = false;
    this.detail = null;
  }

  eventLabel(name: string): string {
    const match = this.billingEvents.find((item) => item.value === name);
    return match && match.value ? match.label : (name || '—');
  }

  shortError(value: string): string {
    if (!value) {
      return '—';
    }
    const line = value.split('\n')[0];
    return line.length > 80 ? line.slice(0, 80) + '…' : line;
  }

  pretty(value: string): string {
    if (!value) {
      return '—';
    }
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }

  maskedToken(token: string): string {
    if (!token) {
      return '—';
    }
    if (this.showToken) {
      return token;
    }
    if (token.length <= 12) {
      return '••••••••';
    }
    return token.slice(0, 4) + '••••••••' + token.slice(-4);
  }

  private load() {
    this.loading = true;
    this.loadError = false;
    this.logService.search(this.kind, {
      from: this.formatDate(this.fromDate),
      to: this.formatDate(this.toDate),
      status: this.status,
      eventName: (this.eventName || '').trim(),
      dutySlipId: (this.dutySlipId || '').trim(),
      reservationId: (this.reservationId || '').trim(),
      driverId: (this.driverId || '').trim(),
      page: this.page,
      pageSize: this.pageSize
    }).subscribe(
      (page) => {
        this.rows = page && page.rows ? page.rows : [];
        this.totalCount = page && page.totalCount ? page.totalCount : 0;
        this.loading = false;
      },
      () => {
        this.rows = [];
        this.totalCount = 0;
        this.loading = false;
        this.loadError = true;
      }
    );
  }

  private formatDate(value: Date): string {
    const date = value ? new Date(value) : new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }
}
