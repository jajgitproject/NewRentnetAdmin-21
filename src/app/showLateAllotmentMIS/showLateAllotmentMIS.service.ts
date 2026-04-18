// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ShowLateAllotmentMISService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "lateAllotmentMIS";
  }
  /** CRUD METHODS */
  getTableData(SearchFromDate:string,SearchToDate:string,SearchServiceLocation:string,SearchTimeDiff:number,PageNumber: number):  Observable<any> 
  {
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
    if(SearchToDate==="")
    {
      SearchToDate="null";
    }
    if(SearchServiceLocation==="")
    {
      SearchServiceLocation="null";
    }
    return this.httpClient.get(this.API_URL + "/" + 'getAllLateAllotment' + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchServiceLocation + '/' + SearchTimeDiff + '/' + PageNumber + '/ReservationID/Descending');
  }

  getTableDataSort(SearchFromDate:string,SearchToDate:string,SearchServiceLocation:string,SearchTimeDiff:number,PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
    if(SearchToDate==="")
    {
      SearchToDate="null";
    }
    if(SearchServiceLocation==="")
    {
      SearchServiceLocation="null";
    }
    return this.httpClient.get(this.API_URL + "/" + 'getAllLateAllotment' + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchServiceLocation + '/' + SearchTimeDiff + '/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  
}
  

