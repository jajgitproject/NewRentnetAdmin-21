// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { TotalBookingCountDetails } from './totalBookingCountDetails.model';

@Injectable()
export class TotalBookingCountDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "controlPanel/";
  }

  GetBookingCount(): Observable<TotalBookingCountDetails[]> {
    return this.httpClient.get<TotalBookingCountDetails[]>(this.API_URL + "GetTotalBookingCount");
  }
 
}
