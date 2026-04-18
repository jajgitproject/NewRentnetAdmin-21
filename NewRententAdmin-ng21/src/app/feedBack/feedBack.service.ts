// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FeedBack } from './feedBack.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FeedBackService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "feedBack";
  }
  /** CRUD METHODS */
  getTableData(ReservationID:number,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(ReservationID===0)
    {
      ReservationID=0;
    }
    // if(driverName===null)
    //   {
    //     driverName=null;
    //   }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"+ReservationID + '/' + SearchActivationStatus +'/' + PageNumber + '/tripFeedBackID/Ascending');
  }
  getTableDataSort(ReservationID:number,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(ReservationID===0)
      {
        ReservationID=0;
      }
    // if(driverName===null)
    //   {
    //     driverName=null;
    //   }
   
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    console.log(this.API_URL + "/"+ReservationID + '/'  + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/"+ReservationID + '/'  + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: FeedBack) 
  {
    advanceTable.tripFeedBackID=-1;
    // if(!advanceTable.feedbackEnteredBy){
    //   advanceTable.feedbackEnteredBy=null
    // }
    //  if(!advanceTable.passengerID){
    //   advanceTable.passengerID=0
    // }
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.employeeID=this.generalService.getUserID();
    advanceTable.dateOfFeedbackString=this.generalService.getTimeFrom(advanceTable.dateOfFeedback);
    advanceTable.timeOfFeedbackString=this.generalService.getTimeTo(advanceTable.timeOfFeedback);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: FeedBack)
  {
    // if(!advanceTable.feedbackEnteredBy){
    //   advanceTable.feedbackEnteredBy=null
    // }
    //  if(!advanceTable.passengerID){
    //   advanceTable.passengerID=0
    // }
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.employeeID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(tripFeedBackID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ tripFeedBackID);
  }
}
