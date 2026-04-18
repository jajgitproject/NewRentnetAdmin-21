// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FeedBackAttachment } from './feedBackAttachment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FeedBackAttachmentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "feedBackAttachment";
  }
  /** CRUD METHODS */
  getTableData(tripFeedBack_ID:number,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    
    if(tripFeedBack_ID===0)
    {
      tripFeedBack_ID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +tripFeedBack_ID + '/' + SearchActivationStatus +'/' + PageNumber + '/tripFeedBackAttachmentID/Ascending');
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
    console.log(this.API_URL + "/" +SearchRate + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + "/" +SearchRate + '/'+Service_ID + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: FeedBackAttachment) 
  {
    advanceTable.tripFeedBackAttachmentID=-1;
    console.log(this.API_URL , advanceTable)
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: FeedBackAttachment)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(tripFeedBackAttachmentID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ tripFeedBackAttachmentID);
  }
}
