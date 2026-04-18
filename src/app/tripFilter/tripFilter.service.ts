// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TripFilter } from './tripFilter.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class TripFilterService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "tripFilter";
  }
  /** CRUD METHODS */
  getTableData(SearchTripFilter:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchTripFilter==="")
    {
      SearchTripFilter="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchTripFilter + '/' + SearchActivationStatus +'/' + PageNumber + '/TripFilter/Ascending');
  }

  getTableDataSort(SearchTripFilter:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchTripFilter==="")
    {
      SearchTripFilter="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchTripFilter + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: TripFilter) 
  {
    advanceTable.tripFilterID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: TripFilter)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(tripFilterID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ tripFilterID);
  }

  
}
  

