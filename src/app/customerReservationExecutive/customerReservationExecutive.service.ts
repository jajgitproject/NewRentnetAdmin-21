// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerReservationExecutive } from './customerReservationExecutive.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerReservationExecutiveService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerReservationExecutive";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerReservationExecutive:string,SearchEmployeeName:string, SearchStartDate:string,SearchEndDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(SearchCustomerReservationExecutive==="")
    {
      SearchCustomerReservationExecutive="null";
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
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerReservationExecutive + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/customerReservationExecutiveID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerReservationExecutive:string,SearchEmployeeName:string,SearchStartDate:string,SearchEndDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerReservationExecutive==="")
    {
      SearchCustomerReservationExecutive="null";
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
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerReservationExecutive  + '/' + SearchEmployeeName + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  private prepareSaveBody(
    src: Record<string, unknown>,
    mode: 'create' | 'update'
  ): Record<string, unknown> {
    const body: Record<string, unknown> = { ...src };
    if (mode === 'create') {
      body.customerReservationExecutiveID = -1;
    } else {
      body.customerReservationExecutiveID = Number(
        src['customerReservationExecutiveID'] ??
          src['customerReservationExecutiveid'] ??
          -1
      );
    }
    body.customerID = Number(src['customerID'] ?? src['CustomerID'] ?? 0);
    body.employeeID = Number(src['employeeID'] ?? src['EmployeeID'] ?? 0);
    if (body.activationStatus === '' || body.activationStatus == null) {
      body.activationStatus = true;
    }
    const fromDate = src['fromDate'] as Date;
    body.fromDate = fromDate;
    body.fromDateString = this.generalService.getTimeApplicable(fromDate);
    let toDate = src['toDate'] as Date | null | undefined;
    if (!toDate || (toDate instanceof Date && Number.isNaN(toDate.getTime()))) {
      toDate = fromDate;
    }
    body.toDate = toDate;
    body.toDateString = this.generalService.getTimeApplicableTO(toDate);
    return body;
  }

  add(advanceTable: CustomerReservationExecutive | Record<string, unknown>) 
  {
    const body = this.prepareSaveBody(advanceTable as Record<string, unknown>, 'create');
    return this.httpClient.post<any>(this.API_URL , body);
  }
  update(advanceTable: CustomerReservationExecutive | Record<string, unknown>)
  {
    const body = this.prepareSaveBody(advanceTable as Record<string, unknown>, 'update');
    return this.httpClient.put<any>(this.API_URL , body);
  }
  delete(customerReservationExecutiveid: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerReservationExecutiveid);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
