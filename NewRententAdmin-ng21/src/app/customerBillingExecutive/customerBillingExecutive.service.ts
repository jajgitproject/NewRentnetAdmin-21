// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerBillingExecutive } from './customerBillingExecutive.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerBillingExecutiveService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerBillingExecutive";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerBillingExecutive:string,SearchEmployeeName:string, SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(SearchCustomerBillingExecutive==="")
    {
      SearchCustomerBillingExecutive="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
   
    //console.log(this.API_URL + '/'+CustomerID +'/'+SearchCustomerBillingExecutive  + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerBillingExecutiveID/Ascending')
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerBillingExecutive + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerBillingExecutiveID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerBillingExecutive:string,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerBillingExecutive==="")
    {
      SearchCustomerBillingExecutive="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchStartDate==="")
    {
      SearchStartDate="null";
    }
    if(SearchEndDate==="")
    {
      SearchEndDate="null";
    }
    //console.log(this.API_URL + "/kkk" +SearchCustomerBillingExecutive + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerBillingExecutive  + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerBillingExecutive) 
  {
     
    advanceTable.customerBillingExecutiveID=-1;
   
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerBillingExecutive)
  {
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerBillingExecutiveid: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerBillingExecutiveid);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
