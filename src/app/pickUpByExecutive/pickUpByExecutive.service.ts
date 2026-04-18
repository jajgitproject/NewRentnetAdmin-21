// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { PickUpByExecutive } from './pickUpByExecutive.model';
@Injectable()
export class PickUpByExecutiveService 
{
  private API_URL:string = '';
  private API_URL_App:string = '';
  private API_URL_GPS:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "pickUpByExecutive";
    this.API_URL_App=generalService.BaseURL+ "pickupByApp";
    this.API_URL_GPS=generalService.BaseURL+ "gTrackData";
  }
  /** CRUD METHODS */
  update(advanceTable: PickUpByExecutive)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.pickUpDateString=this.generalService.getTimeApplicable(advanceTable.pickUpDate);
    advanceTable.pickUpTimeString=this.generalService.getTimeApplicableTO(advanceTable.pickUpTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  getDutySlip(allotmentID:Number)
  {
    return this.httpClient.get(this.API_URL + "/"+'getDutySlipDetails'+ "/"+allotmentID);
  }

  getPickupAppExectiveDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL_App + '/ForgetDutySlipDetails/' + allotmentID}`);
  }

  getPickUpDriverExectiveDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/getDutySlipDriverDetails/' + allotmentID}`);
  }

  fetchAppCurrentData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchCurrentDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppPreviousData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchPreviousDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }

  fetchAppNextData(pickupDate:string,pickupTime:string)
  {
    return this.httpClient.get(this.API_URL + "/"+'fetchNextDataFromApp'+ "/"+pickupDate+ "/"+pickupTime);
  }
  getDataFromGPS(pickupDate: string, pickupTime:string,reseravtionID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_GPS + '/getLiveDataFromGTrack/' + pickupDate + "/"+ pickupTime+"/"+reseravtionID);
  }
  
}
  

