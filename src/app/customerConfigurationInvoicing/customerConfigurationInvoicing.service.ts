// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerConfigurationInvoicing } from './customerConfigurationInvoicing.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerConfigurationInvoicingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerConfigurationInvoicing";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerConfigurationInvoicing:string, SearchGstNumber:string,SearchbillingName:string,SearchActivationStatus:boolean,  PageNumber: number):  Observable<any> 
  {

    if(SearchCustomerConfigurationInvoicing==="")
    {
      SearchCustomerConfigurationInvoicing="null";
    }
    if(SearchGstNumber==="")
    {
      SearchGstNumber="null";
    }
    if(SearchbillingName==="")
    {
      SearchbillingName="null";
    }
   
    if(SearchActivationStatus===null)
      {
        SearchActivationStatus=null;
      }
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerConfigurationInvoicing  + '/' + SearchGstNumber+'/' + SearchbillingName +'/' + SearchActivationStatus +'/' + PageNumber + '/customerConfigurationInvoicingID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerConfigurationInvoicing:string, SearchGstNumber:string,SearchbillingName:string, SearchActivationStatus:boolean,  PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerConfigurationInvoicing==="")
    {
      SearchCustomerConfigurationInvoicing="null";
    }
    if(SearchGstNumber==="")
    {
      SearchGstNumber="null";
    }
    if(SearchbillingName==="")
    {
      SearchbillingName="null";
    }
    if(SearchActivationStatus===null)
      {
        SearchActivationStatus=null;
      }
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerConfigurationInvoicing  + '/' + SearchGstNumber+'/' + SearchbillingName +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerConfigurationInvoicing) 
  {
    advanceTable.customerConfigurationInvoicingID=-1;  
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString = advanceTable.startDate ? this.generalService.getTimeApplicable(advanceTable.startDate) : '';
    advanceTable.endDateString = advanceTable.endDate ? this.generalService.getTimeApplicableTO(advanceTable.endDate) : '';
    advanceTable.sezStartDateString = advanceTable.sezStartDate ? this.generalService.getTimeApplicable(advanceTable.sezStartDate) : '';
    advanceTable.sezEndDateString = advanceTable.sezEndDate ? this.generalService.getTimeApplicableTO(advanceTable.sezEndDate) : '';
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerConfigurationInvoicing)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.startDateString = advanceTable.startDate ? this.generalService.getTimeApplicable(advanceTable.startDate) : '';
    advanceTable.endDateString = advanceTable.endDate ? this.generalService.getTimeApplicableTO(advanceTable.endDate) : '';
    advanceTable.sezStartDateString = advanceTable.sezStartDate ? this.generalService.getTimeApplicable(advanceTable.sezStartDate) : '';
    advanceTable.sezEndDateString = advanceTable.sezEndDate ? this.generalService.getTimeApplicableTO(advanceTable.sezEndDate) : '';
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerConfigurationInvoicingid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerConfigurationInvoicingid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
