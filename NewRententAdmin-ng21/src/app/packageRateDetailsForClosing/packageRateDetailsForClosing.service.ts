// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()

export class PackageRateDetailsForClosingService 
{
    apiUrl: string = '';
    constructor(
        private http: HttpClient,
        private datePipe: DatePipe,
        private generalService: GeneralService
    ) {
        this.apiUrl = generalService.BaseURL + "packageRateDetailsForClosing";
    }

    getPackageRateDetailsForClosingData(dutySlipID: number,reservationID:number): Observable<any> {
        return this.http.get(this.apiUrl + '/' + dutySlipID +'/' + reservationID);
    }
}
