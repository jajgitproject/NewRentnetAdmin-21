// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddStop } from './addStop.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AddStopService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "addStop";
  }
  /** CRUD METHODS */
  getTableData( ReservationID:number,AddStopID:number,StopType:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(ReservationID== 0)
    {
      ReservationID=0;
    }
    if(AddStopID== 0)
    {
      AddStopID=0;
    }
    if(StopType===null)
    {
      StopType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +ReservationID + '/'+AddStopID + '/' + StopType +'/' + SearchActivationStatus +'/' + PageNumber + '/AddStopID/Ascending');
  }

  add(advanceTable: AddStop) 
  {
    
    advanceTable.stopDateString=this.generalService.getDateFrom(advanceTable.stopDate);
    advanceTable.stopTimeString=this.generalService.getDateTo(advanceTable.stopTime);
    advanceTable.addStopID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: AddStop)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(addStopID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ addStopID);
  }

  
}
  

