// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerServiceExecutive } from './customerServiceExecutive.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerServiceExecutiveService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerServiceExecutive";
  

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchCustomerServiceExecutive:string,SearchSalesPerson:string, SearchReservationExecutive:string,SearchCollectionExecutive:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(SearchCustomerServiceExecutive==="")
    {
      SearchCustomerServiceExecutive="null";
    }
    if(SearchSalesPerson==="")
    {
      SearchSalesPerson="null";
    }
    if(SearchReservationExecutive==="")
    {
      SearchReservationExecutive="null";
    }
    if(SearchCollectionExecutive==="")
    {
      SearchCollectionExecutive="null";
    }
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerServiceExecutive + '/' + SearchSalesPerson + '/' + SearchReservationExecutive+'/' + SearchCollectionExecutive +'/' + SearchActivationStatus +'/' + PageNumber + '/customerServiceExecutiveID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchCustomerServiceExecutive:string,SearchSalesPerson:string,SearchReservationExecutive:string,SearchCollectionExecutive:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchCustomerServiceExecutive==="")
    {
      SearchCustomerServiceExecutive="null";
    }
    if(SearchSalesPerson==="")
    {
      SearchSalesPerson="null";
    }
    if(SearchReservationExecutive==="")
    {
      SearchReservationExecutive="null";
    }
    if(SearchCollectionExecutive==="")
    {
      SearchCollectionExecutive="null";
    }
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchCustomerServiceExecutive  + '/' + SearchSalesPerson + '/' + SearchReservationExecutive+'/' + SearchCollectionExecutive +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerServiceExecutive) 
  {    
    advanceTable.customerServiceExecutiveID=-1; 
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerServiceExecutive)
  {
    advanceTable.startDateString=this.generalService.getTimeApplicable(advanceTable.startDate);
    advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerServiceExecutiveid: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerServiceExecutiveid);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
