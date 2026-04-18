// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DispatchFetchData } from './dispatchFetchData.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DispatchFetchDataService 
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
  getTableData(SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ SearchActivationStatus +'/' + PageNumber + '/DispatchFetchData/Ascending');
  }
  getDispatchCurrentData(pickupDate:string, pickupTime: string):  Observable<any> 
  {
    
    return this.httpClient.get(this.API_URL +'/fetchCurrentDataFromApp/' + pickupDate +'/' + pickupTime);
  }
  GetDispatchPreviousData(pickupDate:string, pickupTime: string):  Observable<any> 
  {
    
    return this.httpClient.get(this.API_URL +'/fetchPreviousDataFromApp/' + pickupDate +'/' + pickupTime);
  }
  GetNextDispatchData(pickupDate:string, pickupTime: string):  Observable<any> 
  {
    
    return this.httpClient.get(this.API_URL +'/fetchNextDataFromApp/' + pickupDate +'/' + pickupTime);
  }

  add(advanceTable: DispatchFetchData) 
  {
    //advanceTable.dispatchFetchDataID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: DispatchFetchData)
  {
   // advanceTable.locationOutDateString=this.generalService.getTimeApplicable(advanceTable.locationOutDate);
    //advanceTable.locationOutTimeString=this.generalService.getTimeApplicableTO(advanceTable.locationOutTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(dispatchFetchDataID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ dispatchFetchDataID);
  }

  getDispatchDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/ForAllotmentData/' + allotmentID);
  }
  
}
  

