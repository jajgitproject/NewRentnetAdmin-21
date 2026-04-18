// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class OdoMeterAndManualDutySlipImageService 
{
  private API_URL:string = '';
  private API_URL_Info:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dutySlipImage";
  }
  /** CRUD METHODS */
  

  getAllotmentIDForDutySlipImage(AllotmentID:number)
  {
    return this.httpClient.get(this.API_URL+"/"+'GetODOMeterAndDutySlipImage'+"/"+AllotmentID);
  }
}
  

