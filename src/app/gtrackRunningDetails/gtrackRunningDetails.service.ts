import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { GtrackFillResult, GtrackRunningDetailsPreview } from './gtrackRunningDetails.model';

export interface GtrackRunningDetailsQuery {
  pickupFrom?: string;
  pickupTo?: string;
  customerGroupId?: number;
  customerId?: number;
  dutySlipIds?: string;
  dutySlipNumbers?: string;
  batchSize?: number;
  afterPickupDate?: string;
  afterPickupTime?: string;
  afterDutySlipId?: number;
}

@Injectable()
export class GtrackRunningDetailsService {
  private apiUrl = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.apiUrl = generalService.BaseURL + 'gtrackRunningDetails';
  }

  preview(query: GtrackRunningDetailsQuery): Observable<GtrackRunningDetailsPreview> {
    let params = new HttpParams();
    if (query.pickupFrom) {
      params = params.set('pickupFrom', query.pickupFrom);
    }
    if (query.pickupTo) {
      params = params.set('pickupTo', query.pickupTo);
    }
    if (query.customerGroupId) {
      params = params.set('customerGroupId', query.customerGroupId.toString());
    }
    if (query.customerId) {
      params = params.set('customerId', query.customerId.toString());
    }
    if (query.dutySlipIds) {
      params = params.set('dutySlipIds', query.dutySlipIds);
    }
    if (query.dutySlipNumbers) {
      params = params.set('dutySlipNumbers', query.dutySlipNumbers);
    }
    if (query.batchSize) {
      params = params.set('batchSize', query.batchSize.toString());
    }
    if (query.afterPickupDate) {
      params = params.set('afterPickupDate', query.afterPickupDate);
    }
    if (query.afterPickupTime) {
      params = params.set('afterPickupTime', query.afterPickupTime);
    }
    if (query.afterDutySlipId) {
      params = params.set('afterDutySlipId', query.afterDutySlipId.toString());
    }
    return this.httpClient.get<GtrackRunningDetailsPreview>(this.apiUrl + '/preview', { params });
  }

  fill(dutySlipIds: number[]): Observable<{ results: GtrackFillResult[] }> {
    return this.httpClient.post<{ results: GtrackFillResult[] }>(this.apiUrl + '/fill', { dutySlipIds });
  }
}
