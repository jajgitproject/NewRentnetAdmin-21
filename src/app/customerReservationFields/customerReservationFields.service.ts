// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerReservationFields } from './customerReservationFields.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerReservationFieldsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerReservationFields";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerReservationFields:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerReservationFields==="")
    {
      SearchCustomerReservationFields="null";
    }
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerReservationFields +'/' + SearchActivationStatus +'/' + PageNumber + '/customerReservationFieldID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerReservationFields:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerReservationFields==="")
    {
      SearchCustomerReservationFields="null";
    }
    
    
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerReservationFields  +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerReservationFields) 
  {
     
    advanceTable.customerReservationFieldID=-1;
    advanceTable.userID=this.generalService.getUserID();
    
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerReservationFields)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerReservationFieldsid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerReservationFieldsid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
