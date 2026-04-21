// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FetchDataFromApp } from './fetchDataFromApp.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FetchDataFromAppService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "pickupByExecutive";
  }
  /** CRUD METHODS */
  getTableData(searchpickupDate:string,searchpickupTime:string):  Observable<any> 
  {
    if(searchpickupDate==="")
    {
      searchpickupDate="null";
    }
    if(searchpickupTime==="")
    {
      searchpickupTime="null";
    }
    return this.httpClient.get(this.API_URL + "/" +searchpickupDate + '/'+searchpickupTime );
  }
  fetchAppCurrentData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchCurrentDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppPreviousData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchPreviousDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppNextData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchNextDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  getTableDataSort(searchpickupDate:string,searchpickupTime:string, coloumName:string,sortType:string ):  Observable<any> 
  {
    if(searchpickupDate==="")
    {
      searchpickupDate="null";
    }
    if(searchpickupTime==="")
    {
      searchpickupTime="null";
    }
  
    return this.httpClient.get(this.API_URL + "/" +searchpickupDate + '/'+searchpickupTime + '/' + '/'+coloumName+'/'+sortType);
  }
//   add(advanceTable: FetchDataFromApp) 
//   {
//     advanceTable.fetchDataFromAppDetailsID
// =-1;
//     return this.httpClient.post<any>(this.API_URL , advanceTable);
//   }
  update(advanceTable: FetchDataFromApp)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(fetchDataFromAppDetailsID
: number):  Observable<any> 
  {
    debugger;
    return this.httpClient.delete(this.API_URL + '/'+ fetchDataFromAppDetailsID
);
  }
}
