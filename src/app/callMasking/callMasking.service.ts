import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GeneralService } from '../general/general.service';
import { CallMaskHistoryPage } from './callMasking.model';

@Injectable()
export class CallMaskingService {
  private apiBase: string;

  constructor(
    private httpClient: HttpClient,
    private generalService: GeneralService
  ) {
    this.apiBase = this.generalService.BaseURL + 'callMaskHistory';
  }

  search(reservationId: number | null, pageNumber: number): Observable<CallMaskHistoryPage> {
    let params = new HttpParams()
      .set('pageNumber', String(pageNumber))
      .set('pageSize', '50');
    if (reservationId != null) {
      params = params.set('reservationID', String(reservationId));
    }
    return this.httpClient.get<CallMaskHistoryPage>(this.apiBase, { params });
  }

  markFree(callMaskId: number, employeeId: number): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(
      this.apiBase + '/free/' + callMaskId,
      { employeeID: employeeId }
    );
  }
}
