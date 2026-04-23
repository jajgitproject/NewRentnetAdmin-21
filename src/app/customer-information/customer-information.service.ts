// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()

export class CustomerInformationService 
{
    apiUrl: string = '';
    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        private generalService: GeneralService
    ) {
        this.apiUrl = generalService.BaseURL + "customerInfoClosing";
    }

    getCustomerInformationClosingData(allotmentID: number): Observable<any> {
        return this.http.get(this.apiUrl + '/getCustomerInfoClosings/' + allotmentID);
    }
}
