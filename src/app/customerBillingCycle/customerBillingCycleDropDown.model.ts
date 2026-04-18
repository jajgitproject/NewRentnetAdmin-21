// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerBillingCycle } from './customerBillingCycle.model';
@Injectable()
export class CustomerBillingCycleService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerBillingCycle";
  }
  /** CRUD METHODS */
  getTableData(
    Customer_ID:number, 
    BillingCycleName:string,
    BillingTypeName:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(BillingCycleName==="")
    {
      BillingCycleName="null";
    }
    if(BillingTypeName==="")
    {
      BillingTypeName="null";
    }
    
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +Customer_ID + '/'+BillingCycleName + '/'+BillingTypeName + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerBillingCycleID/Ascending');
  }
  getTableDataSort(
    Customer_ID:number, 
    BillingCycleName:string,
    BillingTypeName:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
   if(BillingCycleName==="")
    {
      BillingCycleName="null";
    }
    if(BillingTypeName==="")
    {
      BillingTypeName="null";
    }
    
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +Customer_ID + '/'+BillingCycleName + '/'+BillingTypeName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerBillingCycle) 
  {
    advanceTable.customerBillingCycleID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerBillingCycle)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerBillingCycleID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerBillingCycleID+ '/'+ userID);
  }
}

