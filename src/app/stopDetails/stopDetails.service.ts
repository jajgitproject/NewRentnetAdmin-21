// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StopDetails } from './stopDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class StopDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "stopDetails";
  }
  getReservationStopDetails(reservationID: number):  Observable<any> 
  {
    return this.httpClient.get(`${this.API_URL + '/ForReservationStopDetails/' + reservationID}`);
  }
  /** CRUD METHODS */
  // getTableData(SearchStopDetails:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  // {
  //   if(SearchStopDetails==="")
  //   {
  //     SearchStopDetails="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchStopDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/StopDetails/Ascending');
  // }

  // getTableDataSort(SearchStopDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchStopDetails==="")
  //   {
  //     SearchStopDetails="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchStopDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  // }

  // add(advanceTable: StopDetails) 
  // {
  //   advanceTable.stopDetailsID=-1;
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  update(advanceTable: StopDetails)
  {
    advanceTable.reservationStopDateString=this.generalService.getTimeApplicable(advanceTable.reservationStopDate);
    advanceTable.reservationStopTimeString=this.generalService.getTimeTo(advanceTable.reservationStopTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(reservationStopID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationStopID + '/'+ userID);
  }

}
  

