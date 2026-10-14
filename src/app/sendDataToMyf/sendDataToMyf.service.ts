// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class SendDataToMyfService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'SendDataToMyf';
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
    myfStatus: string,
    gtrackStatus: string,
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
      + '/' + this.toRouteParam(myfStatus)
      + '/' + this.toRouteParam(gtrackStatus)
      + '/' + pageNumber
      + '/' + encodeURIComponent(orderByColumn || 'DutySlipID')
      + '/' + encodeURIComponent(order || 'Descending')
      + '/' + pageSize;
    return this.httpClient.get(url);
  }

  payload(dutySlipId: number, channel: string, kind: string): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/payload/' + dutySlipId + '/' + encodeURIComponent(channel) + '/' + encodeURIComponent(kind)
    );
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
