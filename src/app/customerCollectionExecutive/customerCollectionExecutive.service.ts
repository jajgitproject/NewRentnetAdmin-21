// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerCollectionExecutive } from './customerCollectionExecutive.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerCollectionExecutiveService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerCollectionExecutive";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerCollectionExecutive:string,SearchEmployeeName:string, SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(SearchCustomerCollectionExecutive==="")
    {
      SearchCustomerCollectionExecutive="null";
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
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerCollectionExecutive + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerCollectionExecutiveID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerCollectionExecutive:string,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerCollectionExecutive==="")
    {
      SearchCustomerCollectionExecutive="null";
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
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerCollectionExecutive  + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerCollectionExecutive | Record<string, unknown>) 
  {
    const src = advanceTable as Record<string, unknown>;
    const body: Record<string, unknown> = { ...src };
    body.customerCollectionExecutiveID = -1;
    body.userID = this.generalService.getUserID();
    body.customerID = Number(src['customerID'] ?? src['CustomerID'] ?? 0);
    body.employeeID = Number(src['employeeID'] ?? src['EmployeeID'] ?? 0);
    if (body.activationStatus === '' || body.activationStatus == null) {
      body.activationStatus = true;
    }
    const fromDate = src['fromDate'] as Date;
    body.fromDate = fromDate;
    body.fromDateString = this.generalService.getTimeApplicable(fromDate);
    const toDate = src['toDate'] as Date | null | undefined;
    if (toDate) {
      body.toDate = toDate;
      body.toDateString = this.generalService.getTimeApplicableTO(toDate);
    } else {
      body.toDate = null;
      body.toDateString = null;
    }
    return this.httpClient.post<any>(this.API_URL , body);
  }
  update(advanceTable: CustomerCollectionExecutive)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
      if(advanceTable.toDate === null){
     advanceTable.toDateString=null;
    }
    else{
       advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    }
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerCollectionExecutiveid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerCollectionExecutiveid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
