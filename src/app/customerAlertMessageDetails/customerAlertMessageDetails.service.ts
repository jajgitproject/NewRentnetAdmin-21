// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerAlertMessageDetailsService 
{
  private API_URL:string = '';
  private Allotment_URL:string='';
  private API_URL_DriverFeedback:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    // this.Allotment_URL=generalService.BaseURL+ "allotment";
    // this.API_URL_DriverFeedback=generalService.BaseURL+ "driver";
  }
  /** CRUD METHODS */
  

 
}
