// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { Filters } from '../controlPanelDesign/controlPanelDesign.model';
import { AllotmentNotification, AllotmentNotificationReply, CarAndDriverAllotment, DriverNotification} from './CarAndDriverAllotment.model';
@Injectable({
  providedIn: 'root'
})

export class CarAndDriverAllotmentService 
{
  private API_URL:string = '';
  private Notification_API_URL:string = '';
  private User_API_URL:string='';
  private Allotment_URL:string='';
  private AllotmentNotification_API_URL:string = '';
  private AllotmentNotificationReply_API_URL:string = '';
  private API_URL_LatLong:string = '';
  private API_URL_DriverFeedback:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  Trip:string;
  constructor(private httpClient: HttpClient,public datepipe: DatePipe, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "CarAndDriverAllotment";
    this.User_API_URL=generalService.BaseURL+ "reservationBookerID";
    this.Allotment_URL=generalService.BaseURL+ "allotment";
    this.Notification_API_URL=generalService.BaseURL+ "notification";
    this.AllotmentNotification_API_URL=generalService.BaseURL+ "allotmentNotification";
    this.AllotmentNotificationReply_API_URL=generalService.BaseURL+ "allotmentNotificationReply";
    this.API_URL_LatLong=generalService.BaseURL+ "driverInventoryAssociation";
    this.API_URL_DriverFeedback=generalService.BaseURL+ "driver";
  }

  GetLatLong(PickupAddress:any){
    return this.httpClient.get(this.API_URL_LatLong+ '/PickupLatLong/'+PickupAddress);
  }

  GetAllDriver(PickupAddress:any){
    return this.httpClient.get(this.API_URL_LatLong+ '/CalculateDistances/'+PickupAddress);
  }

  GetDriverDuty(PickupDate:any,DriverID:any){
    return this.httpClient.get(this.Allotment_URL+ '/ForDriverDutyData/'+PickupDate+"/"+DriverID);
  }

  GetPreviousDriverDuty(PickupDate:any,DriverID:any){
    return this.httpClient.get(this.Allotment_URL+ '/ForPreviousDriverDutyData/'+PickupDate+"/"+DriverID);
  }

  GetNextDriverDuty(PickupDate:any,DriverID:any){
    return this.httpClient.get(this.Allotment_URL+ '/ForNextDriverDutyData/'+PickupDate+"/"+DriverID);
  }

  GetAllotmentStatus(reservationID:any){
    return this.httpClient.get(this.Allotment_URL+ '/getAllotmentStatus/'+reservationID);
  }

  addBidNotification(advanceTable: DriverNotification) 
  {
    advanceTable.bidID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.Notification_API_URL , advanceTable);
  }
  
  addAllotmentNotification(advanceTable: AllotmentNotification) 
  {
    advanceTable.driverAllotmentNotificationID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.AllotmentNotification_API_URL , advanceTable);
  }

  updateAllotmentNotificationReply(advanceTable: AllotmentNotificationReply) 
  {
    advanceTable.driverAcceptanceEnteredByEmployeeID=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.AllotmentNotificationReply_API_URL , advanceTable);
  }

  GetAllotmentNotificationID(AllotmentID:number){
    return this.httpClient.get(this.AllotmentNotificationReply_API_URL+ '/getAllotmentNotificationID/'+AllotmentID);
  }

  GetExistingBids(reservationID:any,pageNumber:Number)
  {
    return this.httpClient.get(this.Notification_API_URL+"/"+reservationID+"/"+pageNumber);
  }
  delete(allotmentID: number):  Observable<any> 
   {
       
  return this.httpClient.delete(this.Allotment_URL + '/'+ allotmentID);
 }

GetDriverFeedbackAverage(driverID:any){
  return this.httpClient.get(this.API_URL_DriverFeedback+ '/GetDriverFeedbackAverage/'+driverID);
      }

  GetDriverRestricted(passengerID:any)
  {
    return this.httpClient.get(this.API_URL_DriverFeedback+ '/GetDriversRestrictedForPassenger/'+passengerID);
  }

  GetCarRestricted(passengerID:any)
  {
    return this.httpClient.get(this.API_URL_DriverFeedback+ '/GetCarsRestrictedForPassenger/'+passengerID);
  }

    
}
