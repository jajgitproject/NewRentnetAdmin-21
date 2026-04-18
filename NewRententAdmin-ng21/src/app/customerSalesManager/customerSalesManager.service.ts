// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerSalesManager } from './customerSalesManager.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerSalesManagerService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerSalesManager";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerSalesManager:string,SearchEmployeeName:string, SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(SearchCustomerSalesManager==="")
    {
      SearchCustomerSalesManager="null";
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
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerSalesManager + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerSalesManagerID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerSalesManager:string,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerSalesManager==="")
    {
      SearchCustomerSalesManager="null";
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
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerSalesManager  + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerSalesManager) 
  {
     
    advanceTable.customerSalesManagerID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerSalesManager)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerSalesManagerid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerSalesManagerid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
