import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

export interface DriverAppLogRow {
  logID: number;
  apiUrl: string;
  httpMethod: string;
  requestedAt: string;
  respondedAt: string;
  httpStatusCode: number;
  apiStatus: string;
  errorMessage: string;
  dutySlipID: number;
  reservationID: number;
  driverID: number;
  eventName: string;
}

export interface DriverAppLogPage {
  totalCount: number;
  rows: DriverAppLogRow[];
}

export interface DriverAppLogDetail extends DriverAppLogRow {
  requestHeaders: string;
  authToken: string;
  requestPayload: string;
  responsePayload: string;
}

export interface DriverAppLogQuery {
  from: string;
  to: string;
  status: string;
  eventName: string;
  dutySlipId: string;
  reservationId: string;
  driverId: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class DriverAppTransactionLogService {
  constructor(private http: HttpClient, private general: GeneralService) {}

  search(kind: 'billing' | 'api', query: DriverAppLogQuery): Observable<DriverAppLogPage> {
    return this.http.get<DriverAppLogPage>(
      this.general.BaseURL + 'driverAppTransactionLog/' + kind,
      { params: this.params(query) }
    );
  }

  get(kind: 'billing' | 'api', id: number): Observable<DriverAppLogDetail> {
    return this.http.get<DriverAppLogDetail>(
      this.general.BaseURL + 'driverAppTransactionLog/' + kind + '/' + id
    );
  }

  private params(query: DriverAppLogQuery): HttpParams {
    let params = new HttpParams()
      .set('from', query.from)
      .set('to', query.to)
      .set('page', String(query.page))
      .set('pageSize', String(query.pageSize));

    if (query.status && query.status !== 'All') {
      params = params.set('status', query.status);
    }
    if (query.eventName) {
      params = params.set('eventName', query.eventName);
    }
    if (query.dutySlipId) {
      params = params.set('dutySlipId', query.dutySlipId);
    }
    if (query.reservationId) {
      params = params.set('reservationId', query.reservationId);
    }
    if (query.driverId) {
      params = params.set('driverId', query.driverId);
    }
    return params;
  }
}
