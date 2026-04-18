// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerBlocking } from './customerBlocking.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerBlockingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerBlocking";
  }
  /** CRUD METHODS */
  getTableData(CustomerBlockingID:number,
    Customer_ID:number, 
    SearchBlockDateFrom:string,
    SearchBlockDateTo:string,
    PageNumber: number):  Observable<any> 
  {
    if(SearchBlockDateFrom==="")
    {
      SearchBlockDateFrom="null";
    }
    if(SearchBlockDateTo==="")
    {
      SearchBlockDateTo="null";
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerBlockingID + '/'+Customer_ID + '/'+SearchBlockDateFrom + '/'+SearchBlockDateTo + '/' + PageNumber + '/customerBlockingID/Ascending');
  }
  getTableDataSort(CustomerBlockingID:number,
    Customer_ID:number, 
    SearchBlockDateFrom:string,
    SearchBlockDateTo:string,
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchBlockDateFrom==="")
    {
      SearchBlockDateFrom="null";
    }
    if(SearchBlockDateTo==="")
    {
      SearchBlockDateTo="null";
    }
    return this.httpClient.get(this.API_URL + "/" +CustomerBlockingID + '/'+Customer_ID + '/'+SearchBlockDateFrom + '/'+SearchBlockDateTo + '/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerBlocking) 
  {
    advanceTable.customerBlockingID=-1;
    advanceTable.blockedByID=this.generalService.getUserID();
    advanceTable.blockDateString=this.generalService.getTimeApplicable(advanceTable.blockDate);
    advanceTable.reasonofUnblocking=null;
    advanceTable.unblockAttachment=null;
    advanceTable.unblockedByID=0;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerBlocking)
  {
    advanceTable.unblockedByID=this.generalService.getUserID();
    advanceTable.blockDateString=this.generalService.getTimeApplicable(advanceTable.blockDate);
    advanceTable.unblockDateString=this.generalService.getTimeApplicable(advanceTable.unblockDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerBlockingID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerBlockingID);
  }
}
