// @ts-nocheck

import { GeneralService } from '../general/general.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialinformationService {
  apiUrl: string = '';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private generalService: GeneralService
  ) {
    this.apiUrl = this.generalService.BaseURL + 'specialInstructionForClosing';
    //console.log('Constructed API URL:', this.apiUrl); // ✅ Debug log
  }

  getSpecialinformationClosingData(allotmentID: number): Observable<any> {
    const fullUrl = `${this.apiUrl}/ForSpecialInstructionForClosing/${allotmentID}`;
   // console.log("Hitting API:", fullUrl); // ✅ Debug log
    return this.http.get(fullUrl);
  }
}

