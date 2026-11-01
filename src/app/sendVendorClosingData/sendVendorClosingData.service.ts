// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class SendVendorClosingDataService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'SendVendorClosingData';
  }

  private toRouteParam(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    const text = String(value).trim();
    if (text === '' || text === 'null' || text === 'All') {
      return 'null';
    }
    return encodeURIComponent(text).replace(/\./g, '%2E');
  }

  private toIdList(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    const text = String(value).trim();
    if (text === '' || text === 'null') {
      return 'null';
    }
    return this.toRouteParam(text.replace(/,/g, '~'));
  }

  search(
    fromDate: string,
    toDate: string,
    dutySlipIds: string,
    reservationIds: string,
    customerId: number,
    vendor: string,
    status: string,
    pageNumber: number,
    orderByColumn: string,
    order: string,
    pageSize: number
  ): Observable<any> {
    const url = this.API_URL + '/search'
      + '/' + this.toRouteParam(fromDate)
      + '/' + this.toRouteParam(toDate)
      + '/' + this.toIdList(dutySlipIds)
      + '/' + this.toIdList(reservationIds)
      + '/' + (customerId > 0 ? customerId : 'null')
      + '/' + this.toRouteParam(vendor)
      + '/' + this.toRouteParam(status)
      + '/' + pageNumber
      + '/' + encodeURIComponent(orderByColumn || 'DutySlipID')
      + '/' + encodeURIComponent(order || 'Descending')
      + '/' + pageSize;
    return this.httpClient.get(url);
  }

  customers(prefix: string): Observable<any[]> {
    const text = String(prefix || '').trim();
    if (text.length < 3) {
      return of([]);
    }
    return this.httpClient.get<any[]>(
      this.generalService.BaseURL + 'Customer/ForDropDownPrefix/' + encodeURIComponent(text)
    );
  }

  exportRows(
    fromDate: string,
    toDate: string,
    dutySlipIds: string,
    reservationIds: string,
    customerId: number,
    vendor: string,
    orderByColumn: string,
    order: string
  ): Observable<any[]> {
    const url = this.API_URL + '/export'
      + '/' + this.toRouteParam(fromDate)
      + '/' + this.toRouteParam(toDate)
      + '/' + this.toIdList(dutySlipIds)
      + '/' + this.toIdList(reservationIds)
      + '/' + (customerId > 0 ? customerId : 'null')
      + '/' + this.toRouteParam(vendor)
      + '/' + encodeURIComponent(orderByColumn || 'DutySlipID')
      + '/' + encodeURIComponent(order || 'Descending');
    return this.httpClient.get<any[]>(url);
  }

  payload(dutySlipId: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/payload/' + dutySlipId);
  }

  start(dutySlipIds: number[], batchSize: number, batchCreatedById: number): Observable<any> {
    return this.httpClient.post(this.API_URL + '/start', {
      dutySlipIds,
      batchSize,
      batchCreatedByID: batchCreatedById
    });
  }

  batchStatus(batchIds: number[]): Observable<any> {
    const ids = (batchIds || []).filter((id) => id > 0).join('~');
    return this.httpClient.get(this.API_URL + '/batchStatus/' + (ids || '0'));
  }

  active(): Observable<any> {
    return this.httpClient.get(this.API_URL + '/active');
  }
}
