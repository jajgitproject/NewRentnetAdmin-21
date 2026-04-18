// @ts-nocheck

import { GeneralService } from '../general/general.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IternallinformationService {
  apiUrl: string = '';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private generalService: GeneralService
  ) {
    this.apiUrl = this.generalService.BaseURL + 'internalNoteForClosing';
    //console.log('Constructed API URL:', this.apiUrl); // ✅ Debug log
  }

  getIternallinformationClosingData(reservationID: number): Observable<any> {
    const fullUrl = `${this.apiUrl}/internalNoteForClosing/${reservationID}`;
    //console.log("Hitting API:", fullUrl); // ✅ Debug log
    return this.http.get(fullUrl);
  }
}

