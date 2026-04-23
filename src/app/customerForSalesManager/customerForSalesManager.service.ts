// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CustomerForSalesManagerModel, CustomerSalesManagerModel } from './customerForSalesManager.model';
@Injectable()
export class CustomerForSalesManagerService 
{
  private API_URL:string = '';
  private API_URL_CustomerForSalesManager:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customer";
    this.API_URL_CustomerForSalesManager=generalService.BaseURL+ "salesManagerForCustomer";
  }
  /** CRUD METHODS */
  getTableData(EmployeeID:number,
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL_CustomerForSalesManager + "/" + EmployeeID + '/' + searchCustomerName + '/'+ searchCustomerType+ '/'+ searchcustomerGroup + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerName/Ascending');
  }
  getTableDataSort(EmployeeID:number,
    searchCustomerName:string,
    searchCustomerType:string,
    searchcustomerGroup:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(searchCustomerName==="")
    {
      searchCustomerName="null";
    }
    if(searchCustomerType==="")
    {
      searchCustomerType="null";
    }
    if(searchcustomerGroup==="")
    {
      searchcustomerGroup="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL_CustomerForSalesManager + "/" + EmployeeID + '/' + searchCustomerName + '/'+ searchCustomerType + '/'+ searchcustomerGroup + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }


  add(advanceTable: CustomerSalesManagerModel) 
  {
    advanceTable.customerSalesManagerID=-1;
    advanceTable.userID=this.generalService.getUserID();
    //advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    //advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL_CustomerForSalesManager , advanceTable);
  }
}
