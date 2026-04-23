// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerInfo } from './customerInfo.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerInfoService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerInfo";
  }
  /** CRUD METHODS */
  getTableData(customerID:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL+'/'+customerID);
  }

  // getTableDataSort(SearchcustomerInfo:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  // {
  //   if(SearchcustomerInfo==="")
  //   {
  //     SearchcustomerInfo="null";
  //   }
  //   if(SearchActivationStatus===null)
  //   {
  //     SearchActivationStatus="null";
  //   }
  //   return this.httpClient.get(this.API_URL + "/" +SearchcustomerInfo + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  // }

  // add(advanceTable: customerInfo) 
  // {
  //   advanceTable.customerInfoID=-1;
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  update(advanceTable: CustomerInfo)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  // delete(customerInfoID: number):  Observable<any> 
  // {
  //   return this.httpClient.delete(this.API_URL + '/'+ customerInfoID);
  // }

  
}
  

