// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerConfigurationBilling } from './customerConfigurationBilling.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerConfigurationBillingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerConfigurationBilling";
  }
  /** CRUD METHODS */
  getTableData(SearchID:number,CustomerID:number,searchBillingBranch:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchBillingBranch==="")
      {
        searchBillingBranch="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchID + '/'+CustomerID + '/'+searchBillingBranch + '/' + SearchActivationStatus +'/' + PageNumber + '/customerConfigurationBillingID/Ascending');
  }
  getTableDataSort(SearchID:number,CustomerID:number,searchBillingBranch:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchBillingBranch==="")
      {
        searchBillingBranch="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchID + '/'+CustomerID + '/'+searchBillingBranch + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerConfigurationBilling) 
  {
    advanceTable.customerConfigurationBillingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.isSEZCustomer=null;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerConfigurationBilling)
  {
    advanceTable.isSEZCustomer=null;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerConfigurationBillingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerConfigurationBillingID+ '/'+ userID);
  }
}
