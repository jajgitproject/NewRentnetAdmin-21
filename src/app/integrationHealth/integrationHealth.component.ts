// @ts-nocheck
import { Component, OnInit } from '@angular/core';
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

  vendors: VendorCard[] = [
    { name: 'MoveInSync', successRate: '—', circuitState: 'Closed', tone: 'ok' },
    { name: 'MMT',        successRate: '—', circuitState: 'Closed', tone: 'ok' },
    { name: 'MYF',        successRate: '—', circuitState: 'Closed', tone: 'ok' },
    { name: 'Indecab',    successRate: '—', circuitState: 'Closed', tone: 'ok' },
    { name: 'Adobe',      successRate: '—', circuitState: 'Closed', tone: 'ok' },
    { name: 'Citibank',   successRate: '—', circuitState: 'Closed', tone: 'ok' },
    { name: 'GTrack',     successRate: '—', circuitState: 'Closed', tone: 'ok' },
    { name: 'Dynamics',   successRate: '—', circuitState: 'Closed', tone: 'ok' }
  ];

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
  statusOptions = ['Success','Failure','Retrying','DeadLetter','Recovered'];
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

  // Dummy rows — replace with API call
  failures: FailureRow[] = [
    {
      apiIntegrationLogID: 1001,
      rentnetReservationID: 45621,
      time: '13:01',
      vendor: 'MMT',
      eventName: 'startTrip',
      source: 'DriverApp',
      driverEndpoint: 'pickupByApp',
      reservationNo: 'RN-45621',
      customerName: 'Acme Corp',
      integrationCode: 'MMT-TRIP-9001',
      httpStatus: 503,
      retryCount: 3,
      status: 'Failure',
      error: 'Upstream timeout'
    },
    {
      apiIntegrationLogID: 1002,
      rentnetReservationID: 45619,
      time: '12:54',
      vendor: 'Indecab',
      eventName: 'DriverAssignment',
      source: 'Admin',
      driverEndpoint: '',
      reservationNo: 'RN-45619',
      customerName: 'Globex India',
      integrationCode: 'INDECAB-2219',
      httpStatus: 500,
      retryCount: 5,
      status: 'DeadLetter',
      error: 'Auth token expired'
    },
    {
      apiIntegrationLogID: 1003,
      rentnetReservationID: 45611,
      time: '12:46',
      vendor: 'MoveInSync',
      eventName: 'Tracking',
      source: 'DriverApp',
      driverEndpoint: 'api/events/pushdata',
      reservationNo: 'RN-45611',
      customerName: 'Contoso Pvt Ltd',
      integrationCode: 'MIS-TRK-7781',
      httpStatus: 200,
      retryCount: 1,
      status: 'Recovered',
      error: 'Recovered after retry'
    },
    {
      apiIntegrationLogID: 1004,
      rentnetReservationID: 45609,
      time: '12:30',
      vendor: 'MYF',
      eventName: 'endTrip',
      source: 'DriverApp',
      driverEndpoint: 'dropOffByApp',
      reservationNo: 'RN-45609',
      customerName: 'Northwind Travels',
      integrationCode: 'MYF-END-5520',
      httpStatus: 429,
      retryCount: 2,
      status: 'Retrying',
      error: 'Rate limited'
    }
  ];

  filteredFailures: FailureRow[] = [];
  customerIntegrationOptions: string[] = [];

  displayedColumns = [
    'time', 'vendor', 'eventName', 'source', 'driverEndpoint',
    'rentnetReservationID', 'reservationNo', 'customerIntegration', 'httpStatus',
    'retryCount', 'status', 'error', 'action'
  ];

  chain: DriverChain = {
    reservationNo: 'RN-45621',
    steps: [
      { label: 'dispatchByApp → startDuty (MoveInSync, MYF, CitiBank, MMT)',  result: 'All vendors: Success', tone: 'ok' },
      { label: 'reachedByApp → arrived (MYF, CitiBank, MMT)',                  result: 'All vendors: Success', tone: 'ok' },
      { label: 'pickupByApp → startTrip (MoveInSync, MYF, CitiBank, MMT)',    result: 'MMT failed | Others: Success', tone: 'warn' },
      { label: 'dropOffByApp → endTrip',                                       result: 'Pending', tone: 'warn' }
    ]
  };

  constructor(private integrationHealthService: IntegrationHealthService) {}

  ngOnInit(): void {
    this.filteredFailures = [...this.failures];
    this.loadDummyKpis();
    this.loadDummyVendors();
    this.updateCustomerIntegrationOptions();
  }

  private loadDummyKpis(): void {
    this.kpis = [
      { label: 'Total Calls (24h)', value: '12,480', tone: 'ok'  },
      { label: 'Success Rate',      value: '94.2%',  tone: 'ok'  },
      { label: 'Failure Rate',      value: '5.8%',   tone: 'err' },
      { label: 'Pending Retries',   value: '173',    tone: 'warn' }
    ];
  }

  private loadDummyVendors(): void {
    this.vendors = [
      { name: 'MoveInSync', successRate: '97%', circuitState: 'Closed',    tone: 'ok'   },
      { name: 'MMT',        successRate: '91%', circuitState: 'Closed',    tone: 'warn' },
      { name: 'MYF',        successRate: '89%', circuitState: 'Half-Open', tone: 'warn' },
      { name: 'Indecab',    successRate: '72%', circuitState: 'Open',      tone: 'err'  },
      { name: 'Adobe',      successRate: '95%', circuitState: 'Closed',    tone: 'ok'   },
      { name: 'Citibank',   successRate: '93%', circuitState: 'Closed',    tone: 'ok'   },
      { name: 'GTrack',     successRate: '98%', circuitState: 'Closed',    tone: 'ok'   },
      { name: 'Dynamics',   successRate: '99%', circuitState: 'Closed',    tone: 'ok'   }
    ];
  }

  applyFilters(): void {
    this.filteredFailures = this.failures.filter(r => {
      const vendorOk   = !this.filters.vendor         || r.vendor         === this.filters.vendor;
      const statusOk   = !this.filters.status         || r.status         === this.filters.status;
      const sourceOk   = !this.filters.source         || r.source         === this.filters.source;
      const endpointOk = !this.filters.driverEndpoint || r.driverEndpoint === this.filters.driverEndpoint;
      const reservationIdOk =
        !this.filters.rentnetReservationID ||
        String(r.rentnetReservationID).includes(this.filters.rentnetReservationID.trim());
      const customerIntegrationTerm = (this.filters.customerIntegrationSearch || '').trim().toLowerCase();
      const customerIntegrationValue = `${r.customerName}##${r.integrationCode}`.toLowerCase();
      const customerIntegrationOk =
        !customerIntegrationTerm ||
        customerIntegrationValue.includes(customerIntegrationTerm);

      return vendorOk && statusOk && sourceOk && endpointOk && reservationIdOk && customerIntegrationOk;
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
            const name = String(customer?.CustomerName ?? '').trim();
            if (name) {
              const codes = this.failures
                .filter((row) => row.customerName.toLowerCase() === name.toLowerCase())
                .map((row) => row.integrationCode)
                .filter((code) => !!code);

              if (codes.length > 0) {
                codes.forEach((code) => options.add(`${name}##${code}`));
              } else {
                options.add(`${name}##`);
              }
            }
          });
          this.customerIntegrationOptions = Array.from(options).sort((a, b) => a.localeCompare(b));
        },
        () => {
          this.updateCustomerIntegrationOptions();
        }
      );
      return;
    }

    this.updateCustomerIntegrationOptions();
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
    this.filteredFailures = [...this.failures];
    this.updateCustomerIntegrationOptions();
  }

  resend(row: FailureRow): void {
    alert(`Resend queued for log #${row.apiIntegrationLogID} (${row.vendor} – ${row.eventName})`);
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
