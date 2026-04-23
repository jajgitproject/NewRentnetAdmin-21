// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { BillingType } from './billingType.model';
@Injectable()
export class BillingTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "billingType";
  }
  /** CRUD METHODS */
  getTableData(SearchBillingTypeName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchBillingTypeName==="")
    {
      SearchBillingTypeName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBillingTypeName + '/' + SearchActivationStatus +'/' + PageNumber + '/BillingTypeName/Ascending');
  }
  getTableDataSort(SearchBillingTypeName:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchBillingTypeName==="")
    {
      SearchBillingTypeName="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchBillingTypeName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: BillingType) 
  {
    advanceTable.billingTypeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BillingType)
  {
advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  
  delete(BillingTypeID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ BillingTypeID + '/'+ userID);
  }

}
  

