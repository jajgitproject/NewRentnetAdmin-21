// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ClosingDetailShowService 
{
  private API_LOC_OUT_IN:string = '';
  private API_PICK_UP:string = '';
  private API_DROP:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_LOC_OUT_IN=generalService.BaseURL+ "dispatchByExecutive";
    //this.API_PICK_UP=generalService.BaseURL+ "pickupByExecutive";
    //this.API_DROP=generalService.BaseURL+ "dropOffByExecutive";  
  }
  
  LocationOut(ReservationID:Number)
  {
    return this.httpClient.get(this.API_LOC_OUT_IN + "/"+'LocationIn'+ "/"+ ReservationID);
  }

  // LocationIn(ReservationID:Number)
  // {
  //   return this.httpClient.get(this.API_LOC_OUT_IN + "/"+'LocationIn'+ "/"+ ReservationID);
  // }

  // PickUp(ReservationID:Number)
  // {
  //   return this.httpClient.get(this.API_PICK_UP + "/"+'PickUpDetails'+ "/"+ ReservationID);
  // }

  // Drop(ReservationID:Number)
  // {
  //   return this.httpClient.get(this.API_DROP + "/"+'DropOffDetails'+ "/"+ ReservationID);
  // }

}
  

