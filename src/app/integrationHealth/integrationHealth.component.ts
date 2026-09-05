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
    { label: 'Total Calls (24h)', value: '—', tone: 'ok' },
    { label: 'Success Rate',      value: '—', tone: 'ok' },
    { label: 'Failure Rate',      value: '—', tone: 'err' },
    { label: 'Pending Retries',   value: '—', tone: 'warn' }
  ];

  vendors: VendorCard[] = [];

  vendorOptions = ['MoveInSync','MMT','MYF','Indecab','Adobe','Citibank','GTrack','Dynamics'];
  driverEndpointOptions = [
    'dispatchByApp',
    'reachedByApp',
    'pickupByApp',
    'dropOffByApp',
    'GarageInByApp',
    'api/events/pushdata',
    'multiplePickupDropByApp'
  ];
  statusOptions = ['Success','Failure','Retrying','DeadLetter'];
  sourceOptions  = ['DriverApp','Admin','Scheduled','InboundVendor'];

  filters: HealthFilters = {
    vendor: '',
    status: '',
    source: '',
    driverEndpoint: '',
    rentnetReservationID: '',
    customerIntegrationSearch: '',
    fromDate: '',
    toDate: ''
  };

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

  private range(): { from: string; to: string } {
    const to = this.filters.toDate || new Date().toISOString().slice(0, 10);
    const from = this.filters.fromDate || new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    return { from, to };
  }

  private loadDashboard(): void {
    const { from, to } = this.range();
    this.integrationHealthService.getSummary(from, to).subscribe(
      (summary) => {
        const total = summary?.totalCalls ?? 0;
        const success = summary?.successRate ?? 0;
        const failure = summary?.failureRate ?? 0;
        const pending = summary?.pendingRetries ?? 0;
        this.kpis = [
          { label: 'Total Calls (24h)', value: String(total), tone: 'ok' },
          { label: 'Success Rate', value: success + '%', tone: success >= 90 ? 'ok' : 'warn' },
          { label: 'Failure Rate', value: failure + '%', tone: failure > 10 ? 'err' : 'warn' },
          { label: 'Pending Retries', value: String(pending), tone: pending > 0 ? 'warn' : 'ok' }
        ];
        this.vendors = (summary?.vendors || []).map((v) => ({
          name: v.name || v.Name,
          successRate: v.successRate || v.SuccessRate || '0%',
          circuitState: v.circuitState || v.CircuitState || 'Closed',
          tone: (v.tone || v.Tone || 'ok') as Tone
        }));
      },
      () => {
        this.kpis[0].value = '0';
      }
    );
    this.loadEvents();
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
      integrationCode: row.integrationCode ?? row.IntegrationCode ?? '',
      httpStatus: row.httpStatus ?? row.HttpStatus ?? 0,
      retryCount: row.retryCount ?? row.RetryCount ?? 0,
      status: row.status ?? row.Status ?? 'Failure',
      error: row.error ?? row.Error ?? ''
    };
  }

  private loadEvents(): void {
    this.integrationHealthService.getEvents(this.filters, 1).subscribe(
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
        label: `${r.driverEndpoint || r.source || 'Event'} → ${r.eventName} (${r.vendor})`,
        result: r.status + (r.error ? ': ' + r.error : ''),
        tone: r.status === 'Success' ? 'ok' : (r.status === 'Retrying' ? 'warn' : 'err')
      }))
    };
  }

  resetFilters(): void {
    this.filters = {
      vendor: '',
      status: '',
      source: '',
      driverEndpoint: '',
      rentnetReservationID: '',
      customerIntegrationSearch: '',
      fromDate: '',
      toDate: ''
    };
    this.loadDashboard();
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

  statusClass(status: FailureRow['status']): string {
    if (status === 'Success' || status === 'Recovered') return 'ih-ok';
    if (status === 'Failure' || status === 'DeadLetter') return 'ih-err';
    return 'ih-warn';
  }

  circuitClass(state: string): string {
    if (state === 'Closed')    return 'ih-chip-ok';
    if (state === 'Open')      return 'ih-chip-err';
    return 'ih-chip-warn';
  }
}
