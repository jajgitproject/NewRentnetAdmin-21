// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverCarChangesMISService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "driverCarChangesMIS";
  }
  /** CRUD METHODS */
  getTableData(SearchPickupFromDate:string,SearchPickupToDate:string,SearchDispatchLocation:string,SearchAfterSMSCarChange:string,SearchAllotmentStatus:string,PageNumber: number):  Observable<any> 
  {
    if(SearchPickupFromDate==="")
    {
      SearchPickupFromDate="null";
    }
    if(SearchPickupToDate==="")
    {
      SearchPickupToDate="null";
    }
    if(SearchDispatchLocation==="")
    {
      SearchDispatchLocation="null";
    }
    if(SearchAfterSMSCarChange==="")
    {
      SearchAfterSMSCarChange="null";
    }
    if(SearchAllotmentStatus==="")
    {
      SearchAllotmentStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" + SearchPickupFromDate + '/' + SearchPickupToDate + '/' + SearchDispatchLocation + '/' + SearchAfterSMSCarChange + '/' + SearchAllotmentStatus + '/' + PageNumber + '/ReservationID/Descending');
  }

  getTableDataSort(SearchPickupFromDate:string,SearchPickupToDate:string,SearchDispatchLocation:string,SearchAfterSMSCarChange:string,SearchAllotmentStatus:string,PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchPickupFromDate==="")
    {
      SearchPickupFromDate="null";
    }
    if(SearchPickupToDate==="")
    {
      SearchPickupToDate="null";
    }
    if(SearchDispatchLocation==="")
    {
      SearchDispatchLocation="null";
    }
    if(SearchAfterSMSCarChange==="")
    {
      SearchAfterSMSCarChange="null";
    }
    if(SearchAllotmentStatus==="")
    {
      SearchAllotmentStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" + SearchPickupFromDate + '/' + SearchPickupToDate + '/' + SearchDispatchLocation + '/' + SearchAfterSMSCarChange + '/' + SearchAllotmentStatus + '/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  
}
  

