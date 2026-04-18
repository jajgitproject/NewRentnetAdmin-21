// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class NewFormService 
{
  private API_URL:string = '';
  private Reservation_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "newForm";
    this.Reservation_API_URL=generalService.BaseURL+ "reservation";
    
  }
  
  addUpdateReservationStopDetail(requestPayload: any) {
    const apiUrl = this.generalService.BaseURL+ "reservationStopDetails";
    return this.httpClient.post<any>(apiUrl, requestPayload);
  }

  GetCustomerSpecificFields(reservationID:any)
  {
    return this.httpClient.get(this.Reservation_API_URL+"/"+reservationID);
  }

}
  

