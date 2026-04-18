// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SettledRateDetails } from './settledRateDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SettledRateDetailsService 
{
  private API_URL:string = '';
  private Booking_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationSettledRate";
    this.Booking_API_URL=generalService.BaseURL+ "reservation";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/" +ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationSettledRateID/Ascending');
  }

  GetClosingSettledRate(DutySlipID:number, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + "/GetClosingSettledRate" + "/" +DutySlipID + '/' + SearchActivationStatus +'/' + PageNumber + '/ReservationSettledRateID/Ascending');
  }

  getTableDataSort(SearchSettledRateDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchSettledRateDetails==="")
    {
      SearchSettledRateDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSettledRateDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SettledRateDetails) 
  {
    advanceTable.reservationSettledRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargeEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SettledRateDetails)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargeEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationSettledRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationSettledRateID + '/'+ userID);
  }

  getBookingDataForSR(ReservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.Booking_API_URL +"/getBookingData/"+ReservationID);
  }

  getCDCData(ContractID:any,PackageType :string,CityID: any,packageID:any):  Observable<any> 
  {
    return this.httpClient.get(this.Booking_API_URL +"/GetCDCData/"+ContractID + '/' + PackageType + '/' + CityID + '/' + packageID);
  }

}
  

