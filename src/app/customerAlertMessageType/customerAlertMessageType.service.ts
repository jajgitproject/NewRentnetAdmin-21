// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerAlertMessageType } from './customerAlertMessageType.model';
@Injectable()
export class CustomerAlertMessageTypeService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerAlertMessageType";
  }
  /** CRUD METHODS */
  getTableData(SearchCustomerAlertMessageType:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerAlertMessageType==="")
    {
      SearchCustomerAlertMessageType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerAlertMessageType + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerAlertMessageType/Ascending');
  }
  getTableDataSort(SearchCustomerAlertMessageType:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCustomerAlertMessageType==="")
    {
      SearchCustomerAlertMessageType="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerAlertMessageType + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerAlertMessageType) 
  {
    advanceTable.customerAlertMessageTypeID=-1;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerAlertMessageType)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerAlertMessageTypeID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerAlertMessageTypeID);
  }

}
  

