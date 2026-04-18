// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReservationStopDetails } from './reservationStopDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { GoogleAddress } from '../reservation/reservation.model';
@Injectable()
export class ReservationStopDetailsService 
{
  private API_URL:string = '';
  private GA_API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "reservationStopDetails";
    this.GA_API_URL=generalService.BaseURL+ "googleAddress";
  }

  addGoogleAddress(advanceTable: GoogleAddress) 
  {
    advanceTable.geoPointID=-1;
    return this.httpClient.post<any>(this.GA_API_URL , advanceTable);
  }

  /** CRUD METHODS */
  getTableData(SearchName:string,
    SearchPrimary:string,
    SearchBilling:string,
    CustomerGroupID:number,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchPrimary==="")
    {
      SearchPrimary="null";
    }
    if(SearchBilling==="")
    {
      SearchBilling="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+SearchPrimary + '/'+SearchBilling + '/'+CustomerGroupID + '/' + SearchActivationStatus +'/' + PageNumber + '/reservationStopDetailsName/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchPrimary:string,
    SearchBilling:string,
    CustomerGroupID:number,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchPrimary==="")
    {
      SearchPrimary="null";
    }
    if(SearchBilling==="")
    {
      SearchBilling="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+SearchPrimary + '/'+SearchBilling + '/'+CustomerGroupID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: ReservationStopDetails) 
  {
    debugger
    advanceTable.reservationStopID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.reservationStopDateString=this.generalService.getTimeApplicable(advanceTable.reservationStopDate);
    if(advanceTable.reservationStopTime === null)
    {
      advanceTable.reservationStopTimeDateString=null;
    }
    else
    {
      advanceTable.reservationStopTimeDateString=this.generalService.getTimeTo(advanceTable.reservationStopTime);
    }
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ReservationStopDetails)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.reservationStopDateString=this.generalService.getTimeApplicable(advanceTable.reservationStopDate);
    if(advanceTable.reservationStopTime === null)
    {
      advanceTable.reservationStopTimeDateString=null;
    }
    else
    {
      advanceTable.reservationStopTimeDateString=this.generalService.getTimeTo(advanceTable.reservationStopTime);
    }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(reservationStopID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationStopID + '/'+ userID);
  }
}
