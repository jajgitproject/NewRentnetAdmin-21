// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ReservationGroupModel } from './bookingConfiguration.model';
@Injectable()
export class BookingConfigurationService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "bookingConfiguration";
  }


  /** CRUD METHODS */
  getCustomerDetails(BookingID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/CustomerDetails/"+BookingID);
  }

  getB2CDetails(BookingID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/B2CDetails/"+BookingID);
  }

  getStopDetails(BookingID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/StopDetails/"+BookingID);
  }

  getPassengerDetails(BookingID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/PassengerDetails/"+BookingID);
  }

  getPackageVehcileDetails(BookingID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/GetPackageVehicleDetails/"+BookingID);
  }

  //---------- Create Reservation Group ----------
  add(advanceTable: ReservationGroupModel) 
  {
    advanceTable.reservationGroupID=-1;
    advanceTable.userID = this.generalService.getUserID();
    // advanceTable.reservationStartDateString=this.generalService.getTimeApplicable(advanceTable.reservationStartDate);
    // advanceTable.reservationEndDateString=this.generalService.getTimeApplicable(advanceTable.reservationEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
   delete(BookingID: number,customerTravelRequestNumber:string):  Observable<any> 
    {
      const params = new HttpParams().set('CustomerTravelRequestNumber', customerTravelRequestNumber);

      return this.httpClient.delete(this.API_URL + '/'+ BookingID , { params });
    }

  GetReservationByID(BookingID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL +"/GetReservationByID/"+BookingID);
  }
}
