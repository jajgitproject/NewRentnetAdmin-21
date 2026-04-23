// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { BillingCycleName } from './billingCycleName.model';
@Injectable()
export class BillingCycleNameService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "billingCycleName";
  }
  /** CRUD METHODS */
  getTableData(SearchBillingCycleName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchBillingCycleName==="")
    {
      SearchBillingCycleName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBillingCycleName + '/' + SearchActivationStatus +'/' + PageNumber + '/BillingCycleName/Ascending');
  }
  getTableDataSort(SearchBillingCycleName:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchBillingCycleName==="")
    {
      SearchBillingCycleName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBillingCycleName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: BillingCycleName) 
  {
    advanceTable.billingCycleID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BillingCycleName)
  {
advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(billingCycleID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ billingCycleID + '/'+ userID);
  }

}
  

