// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DriverFeedbackInfo } from './DriverFeedbackInfo.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverFeedbackInfoService 
{
  private API_URL:string = '';
  private Allotment_URL:string='';
  private API_URL_DriverFeedback:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.Allotment_URL=generalService.BaseURL+ "allotment";
    this.API_URL_DriverFeedback=generalService.BaseURL+ "driver";
  }
  /** CRUD METHODS */
  

  GetDriverFeedBack(DriverID:any){
    return this.httpClient.get(this.Allotment_URL+ '/ForDriverFeedBackData/'+DriverID);
  }

  getDriverFeedBackData(DriverID:number, PageNumber: number):  Observable<any> 
  {
    if(DriverID===0)
    {
      DriverID=0;
    }
    console.log(this.Allotment_URL+'/GetCompleteDriverFeedbackData' +"/"+DriverID+'/' + PageNumber + '/DateOfFeedback/Descending');
    return this.httpClient.get(this.Allotment_URL+'/GetCompleteDriverFeedbackData' +"/"+DriverID +'/' + PageNumber + '/DateOfFeedback/Descending');
  }

  GetDriverFeedbackAverage(driverID:any){
    return this.httpClient.get(this.API_URL_DriverFeedback+ '/GetDriverFeedbackDetails/'+driverID);
  }
  
}
