// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReachedByExecutive } from './reachedByExecutive.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ReachedByExecutiveService 
{
  private API_URL:string = '';
  private API_URL_DateTimeKM:string = '';
  private API_URL_GPS:string = '';
  private API_URL_App:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reachedByExecutive";
    this.API_URL_DateTimeKM=generalService.BaseURL+ "dispatchByExecutive";
    this.API_URL_GPS=generalService.BaseURL+ "gTrackData";
    this.API_URL_App=generalService.BaseURL+ "reachedByApp";
  }

  getReachedByExecutive(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/getDutySlipInfo/' + allotmentID);
  }
  getReachedByDriverExecutive(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetDutySlipDriverInfo/' + allotmentID);
  }
  getReachedByAppExecutive(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_App + '/GetDutySlipAppInfo/' + allotmentID);
  }

  getDataFromGPS(pickupDate: string, pickupTime:string, reservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_GPS + '/getLiveDataFromGTrack/' + pickupDate + "/"+ pickupTime + "/" + reservationID);
  }

  getDataOfDateTimeKM(DutySLipID: number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_DateTimeKM + '/dataOfDateTimeKM/' + DutySLipID);
  }


  /** CRUD METHODS */
  // getTableData(SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  // {
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   return this.httpClient.get(this.API_URL + "/"+ SearchActivationStatus +'/' + PageNumber + '/ReachedByExecutive/Ascending');
  // }
  // getTableDataSort(SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   return this.httpClient.get(this.API_URL + "/" + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  // }

  add(advanceTable: ReachedByExecutive) 
  {
    advanceTable.reportingToGuestEntryExecutiveID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ReachedByExecutive)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.reportingToGuestEntryExecutiveID=this.generalService.getUserID();
    advanceTable.reportingToGuestDateString=this.generalService.getTimeApplicable(advanceTable.reportingToGuestDate);
    advanceTable.reportingToGuestTimeString=this.generalService.getTimeApplicableTO(advanceTable.reportingToGuestTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reachedByExecutiveID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ reachedByExecutiveID);
  }
}
  

