// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerShort } from './customerShort.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerShortService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerShort";
  }
  /** CRUD METHODS */
  getTableData(
    customerGroupID:number,
    searchCustomerShortName:string,
    searchCustomerShortType:string,
    searchCustomerShortCategory:string,
    searchcustomerShortGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchCustomerShortName==="")
    {
      searchCustomerShortName="null";
    }
    if(searchCustomerShortType==="")
    {
      searchCustomerShortType="null";
    }
    if(searchCustomerShortCategory==="")
    {
      searchCustomerShortCategory="null";
    }
    if(searchcustomerShortGroup==="")
    {
      searchcustomerShortGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerGroupID + '/'+searchCustomerShortName + '/'+searchCustomerShortType + '/'+searchCustomerShortCategory + '/'+searchcustomerShortGroup + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerShortID/Ascending');
  }
  getTableDataSort(
    customerGroupID:number,
    searchCustomerShortName:string,
    searchCustomerShortType:string,
    searchCustomerShortCategory:string,
    searchcustomerShortGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchCustomerShortName==="")
    {
      searchCustomerShortName="null";
    }
    if(searchCustomerShortType==="")
    {
      searchCustomerShortType="null";
    }
    if(searchCustomerShortCategory==="")
    {
      searchCustomerShortCategory="null";
    }
    if(searchcustomerShortGroup==="")
    {
      searchcustomerShortGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerGroupID + '/'+searchCustomerShortName + '/'+searchCustomerShortType + '/'+searchCustomerShortCategory + '/'+searchcustomerShortGroup + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: any) 
  {
    advanceTable.customerID=-1;
    advanceTable.companyID=0;
    advanceTable.customerCreatedByID=this.generalService.getUserID();
    advanceTable.treatAsNewCustomerTillDateString=this.generalService.getTimeApplicable(advanceTable.treatAsNewCustomerTillDate);
    advanceTable.customerCreationDateString=this.generalService.getTimeApplicableTO(advanceTable.customerCreationDate);
    console.log(advanceTable);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerShort)
  {
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerID);
  }
}
