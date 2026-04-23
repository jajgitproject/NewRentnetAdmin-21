// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PassengerDetails, ReservationPassenger } from './passengerDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class PassengerDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationPassenger";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" +ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationPassengerID/Ascending');
  }

  getTableDataSort(SearchPassengerDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchPassengerDetails==="")
    {
      SearchPassengerDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchPassengerDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ReservationPassenger) 
  {
    advanceTable.reservationPassengerID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.procCalledFrom="ReservationDetails";
    advanceTable.isPrimaryPassenger=false;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ReservationPassenger)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationPassengerID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationPassengerID + '/'+ userID);
  }

}
  

