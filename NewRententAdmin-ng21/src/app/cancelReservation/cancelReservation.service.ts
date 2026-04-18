// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CancelReservation } from './cancelReservation.model';
@Injectable()
export class CancelReservationService 
{
  private API_URL:string = '';
  private API_URL_:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservation/CancelReservation";
    this.API_URL_=generalService.BaseURL+ "reservation";
  }
  /** CRUD METHODS */
  getTableData(reservationID:number):  Observable<any> 
  {
    if(reservationID===0)
    {
      reservationID=0;
    }
    
    return this.httpClient.get(this.API_URL_ +"/"+'CancelReservationDetails'+  "/" +reservationID );
  }
  getTableDataSort(SearchCancelAllotmentName:string,SearchCancelAllotmentCode:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCancelAllotmentName==="")
    {
      SearchCancelAllotmentName="null";
    }
    if(SearchCancelAllotmentCode==="")
    {
      SearchCancelAllotmentCode="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCancelAllotmentName + '/' +SearchCancelAllotmentCode + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CancelReservation) 
  {
    advanceTable.reservationID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CancelReservation)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(CancelAllotmentID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ CancelAllotmentID);
  }
}
  

