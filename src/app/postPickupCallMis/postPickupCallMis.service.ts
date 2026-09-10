// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { PostPickupCallMisSearchCriteria } from './postPickupCallMis.model';

@Injectable()
export class PostPickupCallMisService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'postPickupCallMIS';
  }

  getTableData(criteria: PostPickupCallMisSearchCriteria, pageNumber: number): Observable<any> {
    const payload = {
      pickupDateFrom: criteria.pickupDateFrom || null,
      pickupDateTo: criteria.pickupDateTo || null,
      postPickupCallFilter: criteria.postPickupCallFilter || 'All',
      pageNumber,
      orderByColumn: criteria.orderByColumn || 'BookingNo',
      order: criteria.order || 'Descending'
    };
    return this.httpClient.post(this.API_URL, payload);
  }
}
