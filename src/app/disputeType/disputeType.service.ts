// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DisputeType } from './disputeType.model';
@Injectable()
export class DisputeTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "disputetype";
  }
  /** CRUD METHODS */
  getTableData(SearchDisputeType:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchDisputeType==="")
    {
      SearchDisputeType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDisputeType + '/' + SearchActivationStatus +'/' + PageNumber + '/DisputeType/Ascending');
  }
  getTableDataSort(SearchDisputeType:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchDisputeType==="")
    {
      SearchDisputeType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchDisputeType + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: DisputeType) 
  {
    advanceTable.disputeTypeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: DisputeType)
  {
advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(disputeTypeID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ disputeTypeID + '/'+ userID);
  }

}
  

