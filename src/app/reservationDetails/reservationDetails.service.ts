// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationDetails } from './reservationDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ReservationDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationDetails";
  }
  /** CRUD METHODS */
  getTableData(reservationID:any):  Observable<any> 
  {
    console.log(this.API_URL+'/'+'ForReservationDetails/'+reservationID);
    return this.httpClient.get(this.API_URL+'/'+'ForReservationDetails/'+reservationID);
  }

  // getTableDataSort(SearchReservationDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchReservationDetails==="")
  //   {
  //     SearchReservationDetails="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchReservationDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  // }

  // add(advanceTable: ReservationDetails) 
  // {
  //   advanceTable.reservationDetailsID=-1;
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  update(advanceTable: ReservationDetails)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  // delete(reservationDetailsID: number):  Observable<any> 
  // {
  //   return this.httpClient.delete(this.API_URL + '/'+ reservationDetailsID);
  // }

  
}
  

