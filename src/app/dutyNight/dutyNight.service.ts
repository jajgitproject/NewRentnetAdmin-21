// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { DutyNight } from './dutyNight.model';

@Injectable()
export class DutyNightService {
  private API_URL: string = '';
  private API_URL_Closing: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'dutyNight';
    this.API_URL_Closing = generalService.BaseURL + 'dutyNightClosing';
  }

  getTableDataforClosing(dutySlipID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/' + dutySlipID);
  }

  add(advanceTable: DutyNight) {
    advanceTable.dutyNightID = -1;
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.changeDateTimeString = this.generalService.getTimeApplicableTO(advanceTable.changeDateTime);
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: DutyNight) {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.changeDateTimeString = this.generalService.getTimeApplicableTO(advanceTable.changeDateTime);
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(dutyNightID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + dutyNightID + '/' + userID);
  }

  getTableDataDutyNightClosing(dutySlipID: number): Observable<any> {
    return this.httpClient.get(this.API_URL_Closing + '/' + dutySlipID);
  }

  hasActiveDutyNight(dutySlipID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/hasActive/' + dutySlipID);
  }
}
