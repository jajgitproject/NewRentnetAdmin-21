// @ts-nocheck

import { GeneralService } from '../general/general.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentdataInformationService {
  apiUrl: string = '';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private generalService: GeneralService
  ) {
    this.apiUrl = this.generalService.BaseURL + 'currentDutyClosing';
  }

  getCurrentdataInformationClosingData(allotmentID: number): Observable<any> {
    const fullUrl = `${this.apiUrl}/GetCurrentDutyClosingByAllotmentID/${allotmentID}`;
    return this.http.get(fullUrl);
  }
}

