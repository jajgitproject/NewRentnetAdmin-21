// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { QcMisCSTSearchCriteria } from './qcMisCst.model';

@Injectable()
export class QcMisCSTService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'qcMisCST';
  }

  getTableData(criteria: QcMisCSTSearchCriteria, pageNumber: number): Observable<any> {
    const payload = {
      pickupDateFrom: criteria.pickupDateFrom || null,
      pickupDateTo: criteria.pickupDateTo || null,
      locationID: criteria.locationID || 0,
      cityID: criteria.cityID || 0,
      pageNumber,
      orderByColumn: criteria.orderByColumn || 'ReservationID',
      order: criteria.order || 'Descending'
    };
    return this.httpClient.post(this.API_URL, payload);
  }
}
