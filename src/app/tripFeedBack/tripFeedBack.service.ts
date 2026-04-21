// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TripFeedBack } from './tripFeedBack.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class TripFeedBackService 
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
  getTableData(SearchRate:string,Service_ID:number,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchRate==="")
    {
      SearchRate="null";
    }
    if(Service_ID===0)
    {
      Service_ID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchRate + '/'+Service_ID + '/' + SearchActivationStatus +'/' + PageNumber + '/TripFeedBackID/Ascending');
  }
  getTableDataSort(SearchRate:string,Service_ID:number, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchRate==="")
    {
      SearchRate="null";
    }
    if(Service_ID===0)
    {
      Service_ID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchRate + '/'+Service_ID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: TripFeedBack) 
  {
    advanceTable.tripTripFeedBackID=-1;
    advanceTable.dateOfFeedbackString=this.generalService.getTimeFrom(advanceTable.dateOfFeedback);
    advanceTable.timeOfFeedbackString=this.generalService.getTimeTo(advanceTable.timeOfFeedback);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: TripFeedBack)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(tripFeedBackID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ tripFeedBackID);
  }
}
