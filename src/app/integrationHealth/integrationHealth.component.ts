// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Kpi, VendorCard, FailureRow, DriverChain, HealthFilters, Tone
} from './integrationHealth.model';
import { IntegrationHealthService } from './integrationHealth.service';

@Component({
  standalone: false,
  selector: 'app-integration-health',
  templateUrl: './integrationHealth.component.html',
  styleUrls: ['./integrationHealth.component.scss']
})
export class IntegrationHealthComponent implements OnInit {
  private readonly autocompleteMinPrefixLength = 3;

  kpis: Kpi[] = [
    { label: 'Total Calls (Today)', value: '—', tone: 'ok' },
    { label: 'Success Rate', value: '—', tone: 'ok' },
    { label: 'Failure Rate', value: '—', tone: 'err' },
    { label: 'Pending Retries', value: '—', tone: 'warn' }
  ];

  vendors: VendorCard[] = [];

  vendorOptions = ['MoveInSync', 'MMT', 'MYF', 'Indecab', 'Adobe', 'CitiBank', 'GTrack', 'Dynamics'];
  aggregatorFilterOptions = [...this.vendorOptions, '(unknown)'];
  driverEndpointOptions = [
    'dispatchByApp',
    'reachedByApp',
    'pickupByApp',
    'dropOffByApp',
    'GarageInByApp',
    'api/events/pushdata',
    'multiplePickupDropByApp'
  ];
  statusOptions = ['Success', 'Failure', 'Retrying', 'DeadLetter'];
  sourceOptions = ['DriverApp', 'Admin', 'Scheduled', 'InboundVendor'];

  filters: HealthFilters = this.defaultFilters();

  failures: FailureRow[] = [];
  filteredFailures: FailureRow[] = [];
  customerIntegrationOptions: string[] = [];

  displayedColumns = [
    'time', 'vendor', 'eventName', 'source', 'driverEndpoint',
    'rentnetReservationID', 'reservationNo', 'customerIntegration', 'httpStatus',
    'retryCount', 'status', 'error', 'action'
  ];

  chain: DriverChain = {
    reservationNo: '',
    steps: []
  };

  constructor(
    private integrationHealthService: IntegrationHealthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  private startOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  private formatLocalDate(value: Date | string | null | undefined): string {
    const date = value instanceof Date
      ? value
      : (value ? new Date(value) : this.startOfToday());
    if (isNaN(date.getTime())) {
      return this.formatLocalDate(this.startOfToday());
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private defaultFilters(): HealthFilters {
    const today = this.startOfToday();
    return {
      vendor: '',
      status: '',
      source: '',
      driverEndpoint: '',
      rentnetReservationID: '',
      customerIntegrationSearch: '',
      fromDate: today,
      toDate: new Date(today.getTime())
    };
  }

  private range(): { from: string; to: string } {
    return {
      from: this.formatLocalDate(this.filters.fromDate),
      to: this.formatLocalDate(this.filters.toDate)
    };
  }

  private totalCallsLabel(from: string, to: string): string {
    const today = this.formatLocalDate(this.startOfToday());
    return from === today && to === today ? 'Total Calls (Today)' : 'Total Calls';
  }

  private emptyVendorCard(name: string): VendorCard {
    return {
      name,
      totalCalls: 0,
      bookingCount: 0,
      successCount: 0,
      failureCount: 0,
      successRate: 'No calls',
      failureRate: 'No calls',
      circuitState: 'Closed',
      tone: 'warn'
    };
  }

  private mergeVendorCards(apiVendors: any[]): VendorCard[] {
    const mapped = (apiVendors || []).map((v) => ({
      name: v.name || v.Name,
      totalCalls: Number(v.totalCalls ?? v.TotalCalls ?? 0),
      bookingCount: Number(v.bookingCount ?? v.BookingCount ?? 0),
      successCount: Number(v.successCount ?? v.SuccessCount ?? 0),
      failureCount: Number(v.failureCount ?? v.FailureCount ?? 0),
      successRate: v.successRate || v.SuccessRate || 'No calls',
      failureRate: v.failureRate || v.FailureRate || 'No calls',
      circuitState: v.circuitState || v.CircuitState || 'Closed',
      tone: (v.tone || v.Tone || 'warn') as Tone
    }));
    const byName = new Map(
      mapped
        .filter((v) => v.name)
        .map((v) => [String(v.name).toLowerCase(), v])
    );
    const cards = this.vendorOptions.map((name) => {
      return byName.get(name.toLowerCase()) || this.emptyVendorCard(name);
    });
    mapped.forEach((v) => {
      if (v.name && !this.vendorOptions.some((n) => n.toLowerCase() === String(v.name).toLowerCase())) {
        cards.push(v);
      }
    });
    return cards;
  }

  private mapRow(row: any): FailureRow {
    return {
      apiIntegrationLogID: row.apiIntegrationLogID ?? row.ApiIntegrationLogID ?? 0,
      rentnetReservationID: row.rentnetReservationID ?? row.RentnetReservationID ?? 0,
      time: row.time ?? row.Time ?? '',
      vendor: row.vendor ?? row.Vendor ?? '',
      eventName: row.eventName ?? row.EventName ?? '',
      source: row.source ?? row.Source ?? '',
      driverEndpoint: row.driverEndpoint ?? row.DriverEndpoint ?? '',
      reservationNo: row.reservationNo ?? row.ReservationNo ?? '',
      customerName: row.customerName ?? row.CustomerName ?? '',
      integrationCode: row.integrationCode ?? row.IntegrationCode ?? row.tallyCustomerID ?? row.TallyCustomerID ?? '',
      httpStatus: row.httpStatus ?? row.HttpStatus ?? 0,
      retryCount: row.retryCount ?? row.RetryCount ?? 0,
      status: row.status ?? row.Status ?? 'Failure',
      error: row.error ?? row.Error ?? ''
    };
  }

  loadDashboard(): void {
    const { from, to } = this.range();
    this.integrationHealthService.getSummary(from, to).subscribe(
      (summary) => {
        const total = summary?.totalCalls ?? summary?.TotalCalls ?? 0;
        const success = summary?.successRate ?? summary?.SuccessRate ?? 0;
        const failure = summary?.failureRate ?? summary?.FailureRate ?? 0;
        const pending = summary?.pendingRetries ?? summary?.PendingRetries ?? 0;
        this.kpis = [
          { label: this.totalCallsLabel(from, to), value: String(total), tone: 'ok' },
          { label: 'Success Rate', value: success + '%', tone: 'ok' },
          { label: 'Failure Rate', value: failure + '%', tone: failure > 10 ? 'err' : 'warn' },
          { label: 'Pending Retries', value: String(pending), tone: pending > 0 ? 'warn' : 'ok' }
        ];
        this.vendors = this.mergeVendorCards(summary?.vendors || summary?.Vendors || []);
      },
      () => {
        this.kpis[0].value = '0';
      }
    );
    this.loadEvents();
  }

  private loadEvents(): void {
    const { from, to } = this.range();
    this.integrationHealthService.getEvents(this.filters, 1, from, to).subscribe(
      (rows) => {
        const list = Array.isArray(rows) ? rows : [];
        this.failures = list.map((row) => this.mapRow(row));
        this.applyLocalFilters();
        this.updateCustomerIntegrationOptions();
        this.updateChain();
      },
      () => {
        this.failures = [];
        this.filteredFailures = [];
      }
    );
  }

  applyFilters(): void {
    this.loadDashboard();
  }

  resetFilters(): void {
    this.filters = this.defaultFilters();
    this.loadDashboard();
  }

  filterByAggregator(name: string): void {
    const selected = String(name || '').trim();
    this.filters.vendor = this.isAggregatorSelected(selected) ? '' : selected;
    this.loadDashboard();
  }

  isAggregatorSelected(name: string): boolean {
    return String(this.filters.vendor || '').toLowerCase() === String(name || '').toLowerCase();
  }

  private applyLocalFilters(): void {
    this.filteredFailures = this.failures.filter((r) => {
      const customerIntegrationTerm = (this.filters.customerIntegrationSearch || '').trim().toLowerCase();
      const customerIntegrationValue = `${r.customerName}##${r.integrationCode}`.toLowerCase();
      return !customerIntegrationTerm || customerIntegrationValue.includes(customerIntegrationTerm);
    });
  }

  onCustomerIntegrationInput(value: string): void {
    this.filters.customerIntegrationSearch = value || '';
    const customerPrefix = this.getCustomerPrefix(this.filters.customerIntegrationSearch);

    if (customerPrefix.length >= this.autocompleteMinPrefixLength) {
      this.integrationHealthService.getCustomersForAutocomplete(customerPrefix).subscribe(
        (customers: any[]) => {
          const options = new Set<string>();
          (customers || []).forEach((customer) => {
            const name = String(
              customer?.customerName ?? customer?.CustomerName ?? ''
            ).trim();
            if (!name) {
              return;
            }
            const tallyCode = String(
              customer?.tallyIntegrationCode
                ?? customer?.TallyIntegrationCode
                ?? customer?.tallyCustomerID
                ?? customer?.TallyCustomerID
                ?? ''
            ).trim();
            options.add(`${name}##${tallyCode}`);
          });
          this.customerIntegrationOptions = Array.from(options).sort((a, b) => a.localeCompare(b));
        },
        () => {
          this.updateCustomerIntegrationOptions();
        }
      );
      this.applyLocalFilters();
      return;
    }

    this.updateCustomerIntegrationOptions();
    this.applyLocalFilters();
  }

  private updateCustomerIntegrationOptions(): void {
    const search = (this.filters.customerIntegrationSearch || '').trim().toLowerCase();
    const unique = new Set<string>();

    this.failures.forEach((row) => {
      const option = `${row.customerName}##${row.integrationCode}`;
      if (!search || option.toLowerCase().includes(search)) {
        unique.add(option);
      }
    });

    this.customerIntegrationOptions = Array.from(unique).sort((a, b) => a.localeCompare(b));
  }

  private getCustomerPrefix(input: string): string {
    const raw = String(input || '').trim();
    if (!raw) {
      return '';
    }
    return raw.split('##')[0].trim();
  }

  private updateChain(): void {
    const first = this.filteredFailures[0];
    if (!first) {
      this.chain = { reservationNo: '', steps: [] };
      return;
    }

    const reservation = first.reservationNo;
    const related = this.failures.filter((r) => r.reservationNo === reservation);
    this.chain = {
      reservationNo: reservation,
      steps: related.map((r) => ({
        label: r.eventName || r.driverEndpoint || r.source,
        result: r.status,
        tone: (r.status === 'Success' || r.status === 'Recovered') ? 'ok' : (r.status === 'Failure' || r.status === 'DeadLetter') ? 'err' : 'warn'
      }))
    };
  }

  resend(row: FailureRow): void {
    const payload = {
      reservationID: row.rentnetReservationID,
      eventName: row.eventName,
      travelRequestNo: row.reservationNo,
      aggregator: row.vendor,
      requestJson: null
    };
    this.integrationHealthService.resend(payload).subscribe(
      (res) => {
        const isSuccess = res?.success === true || res?.Success === true || res?.status === true;
        this.snackBar.open(isSuccess ? 'Resend queued' : (res?.message || res?.Message || 'Resend sent'), 'Close', {
          duration: 3000
        });
        this.loadDashboard();
      },
      () => {
        this.snackBar.open('Resend failed', 'Close', { duration: 3000 });
      }
    );
  }

  vendorRateLabel(vendor: VendorCard): string {
    const rate = String(vendor?.successRate || '').trim();
    if (!rate || rate.toLowerCase() === 'no calls') {
      return 'No calls';
    }
    return rate.toLowerCase().includes('success') ? rate : rate + ' success';
  }

  failureTone(vendor: VendorCard): Tone {
    const raw = String(vendor?.failureRate || '').replace('%', '').trim();
    const rate = Number(raw);
    if (!Number.isFinite(rate) || String(vendor?.failureRate || '').toLowerCase() === 'no calls') {
      return 'warn';
    }
    return rate > 10 ? 'err' : (rate > 0 ? 'warn' : 'ok');
  }

  statusClass(status: FailureRow['status']): string {
    if (status === 'Success' || status === 'Recovered') return 'ih-ok';
    if (status === 'Failure' || status === 'DeadLetter') return 'ih-err';
    return 'ih-warn';
  }

  circuitClass(state: string): string {
    if (state === 'Closed') return 'ih-chip-ok';
    if (state === 'Open') return 'ih-chip-err';
    return 'ih-chip-warn';
  }
}
