// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DropOffByExecutive } from './dropOffByExecutive.model';
@Injectable()
export class DropOffByExecutiveService 
{
  private API_URL:string = '';
  private API_URL_GPS:string = '';
  private API_URL_App:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "dropOffByExecutive";
    this.API_URL_App=generalService.BaseURL+ "dropOffByApp";
    this.API_URL_GPS=generalService.BaseURL+ "gTrackData";
  }
  /** CRUD METHODS */
  getDropOffExectiveDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForDropOffDetails/' + allotmentID}`);
  }

  getDropOffAppExectiveDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL_App + '/ForDropOffAppDetails/' + allotmentID}`);
  }

  getDropOffDriverExectiveDetails(allotmentID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForDropOffDriverDetails/' + allotmentID}`);
  }
  // getTableDataSort(SearchBank:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchBank==="")
  //   {
  //     SearchBank="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus=null;
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchBank + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  // }

  add(advanceTable: DropOffByExecutive) 
  {
    advanceTable.dropOffEntryExecutiveID=-1;
    // advanceTable.updatedBy=this.generalService.getUserID();
    // advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DropOffByExecutive)
  {
    advanceTable.userID=this.generalService.getUserID();
     advanceTable.dropOffEntryExecutiveID=this.generalService.getUserID();
    advanceTable.dropOffDateString=this.generalService.getTimeApplicable(advanceTable.dropOffDate);
    advanceTable.dropOffTimeString=this.generalService.getTimeApplicable(advanceTable.dropOffTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  getDataFromGPS(pickupDate: string, pickupTime:string ,reservationID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_GPS + '/getLiveDataFromGTrack/' + pickupDate + "/"+ pickupTime + "/"+ reservationID);
  }

  delete(dropOffByExecutiveID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+dropOffByExecutiveID);
  }

}
  


