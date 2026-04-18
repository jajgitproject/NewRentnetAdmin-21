// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerOTPConfiguration } from './customerOTPConfiguration.model';
@Injectable()
export class CustomerOTPConfigurationService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerOTPConfiguration";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchstartDate:string,searchendDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchstartDate + '/'+searchendDate + '/' + SearchActivationStatus +'/' + PageNumber + '/customerOTPConfigurationID/Ascending');
  }
  getTableDataSort(customerID:number,searchstartDate:string,searchendDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerID===0)
    {
      customerID=0;
    }
    if(searchstartDate==="")
    {
      searchstartDate="null";
    }
    if(searchendDate==="")
    {
      searchendDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchstartDate + '/'+searchendDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerOTPConfiguration) 
  {
    advanceTable.customerOTPConfigurationID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
     if(!advanceTable.startTripOTPTimerInMinutes){
      advanceTable.startTripOTPTimerInMinutes=0
    }
    if(!advanceTable.endTripOTPTimerInMinutes){
      advanceTable.endTripOTPTimerInMinutes=0
    }
     if(!advanceTable.otpLength){
      advanceTable.otpLength=0
    }
    if(advanceTable.endDate)
      {
        advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
      }
      else
      {
        advanceTable.endDate=null;
      }
   
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerOTPConfiguration)
  {
    advanceTable.userID=this.generalService.getUserID();
    if(!advanceTable.startTripOTPTimerInMinutes){
      advanceTable.startTripOTPTimerInMinutes=0
    }
    if(!advanceTable.endTripOTPTimerInMinutes){
      advanceTable.endTripOTPTimerInMinutes=0
    }
     if(!advanceTable.otpLength){
      advanceTable.otpLength=0
    }
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
   if(advanceTable.endDate)
      {
        advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
      }
      else
      {
        advanceTable.endDate=null;
      }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerOTPConfigurationID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerOTPConfigurationID+ '/'+ userID);
  }
}
