// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  CappingFacilityDateConfigModel,
  CappingFacilityDateConfigSaveRequest,
  CappingFacilityDateConfigSaveResult
} from './cappingFacilityConfig.model';

@Injectable()
export class CappingFacilityConfigService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'cappingFacilityConfig';
  }

  getByRange(fromDate: string, toDate: string): Observable<CappingFacilityDateConfigModel[]> {
    const from = fromDate || 'null';
    const to = toDate || 'null';
    return this.httpClient.get<CappingFacilityDateConfigModel[]>(
      this.API_URL + '/range/' + from + '/' + to
    );
  }

  getAll(): Observable<CappingFacilityDateConfigModel[]> {
    return this.httpClient.get<CappingFacilityDateConfigModel[]>(this.API_URL);
  }

  save(request: CappingFacilityDateConfigSaveRequest): Observable<CappingFacilityDateConfigSaveResult> {
    request.userID = this.generalService.getUserID();
    return this.httpClient.post<CappingFacilityDateConfigSaveResult>(this.API_URL, request);
  }

  delete(cappingFacilityDateConfigID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(
      this.API_URL + '/' + cappingFacilityDateConfigID + '/' + userID
    );
  }
}
