// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PickupDetails } from './pickupDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PickupDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "pickupDetails";
  }
  /** CRUD METHODS */
  getTableData( ReservationID:number,PickupDetailsID:number,StopType:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(ReservationID== 0)
    {
      ReservationID=0;
    }
    if(PickupDetailsID== 0)
    {
      PickupDetailsID=0;
    }
    if(StopType===null)
    {
      StopType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +ReservationID + '/'+PickupDetailsID + '/' + StopType +'/' + SearchActivationStatus +'/' + PageNumber + '/PickupDetailsID/Ascending');
  }

  add(advanceTable: PickupDetails) 
  {
    debugger;
    advanceTable.stopDateString=this.generalService.getDateFrom(advanceTable.stopDate);
    advanceTable.stopTimeString=this.generalService.getDateTo(advanceTable.stopTime);
    advanceTable.pickupDetailsID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: PickupDetails)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(pickupDetailsID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ pickupDetailsID);
  }

  
}
  

