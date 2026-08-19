export type Tone = 'ok' | 'warn' | 'err';
export type CircuitState = 'Closed' | 'Open' | 'Half-Open';
export type EventSource = 'DriverApp' | 'Admin' | 'Scheduled' | 'InboundVendor';
export type FailureStatus = 'Success' | 'Failure' | 'Retrying' | 'DeadLetter' | 'Recovered';

export interface Kpi {
  label: string;
  value: string;
  tone: Tone;
}

export interface VendorCard {
  name: string;
  successRate: string;
  circuitState: CircuitState;
  tone: Tone;
}

export interface FailureRow {
  apiIntegrationLogID: number;
  rentnetReservationID: number;
  time: string;
  vendor: string;
  eventName: string;
  source: EventSource;
  driverEndpoint: string;
  reservationNo: string;
  customerName: string;
  integrationCode: string;
  httpStatus: number;
  retryCount: number;
  status: FailureStatus;
  error: string;
}

export interface DriverChainStep {
  label: string;
  result: string;
  tone: Tone;
}

export interface DriverChain {
  reservationNo: string;
  steps: DriverChainStep[];
}

export interface HealthFilters {
  vendor: string;
  status: string;
  source: string;
  driverEndpoint: string;
  rentnetReservationID: string;
  customerIntegrationSearch: string;
  fromDate: string;
  toDate: string;
}
