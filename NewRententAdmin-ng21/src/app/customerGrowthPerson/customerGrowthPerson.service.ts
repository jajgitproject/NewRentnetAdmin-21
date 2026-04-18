// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerGrowthPerson } from './customerGrowthPerson.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerGrowthPersonService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerGrowthPerson";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( CustomerID:number,SearchgrowthPersonCode:string,SearchEmployeeName:string, SearchgrowthPersonManageCode:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
 
    if(SearchgrowthPersonCode==="")
    {
      SearchgrowthPersonCode="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchgrowthPersonManageCode==="")
    {
      SearchgrowthPersonManageCode="null";
    }
    
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchgrowthPersonCode + '/' + SearchEmployeeName + '/' + SearchgrowthPersonManageCode +'/' + SearchActivationStatus +'/' + PageNumber + '/customerGrowthPersonID/Ascending');
  }

  getTableDataSort(CustomerID:number,SearchgrowthPersonCode:string,SearchEmployeeName:string,SearchgrowthPersonManageCode:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchgrowthPersonCode==="")
    {
      SearchgrowthPersonCode="null";
    }
    if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchgrowthPersonManageCode==="")
    {
      SearchgrowthPersonManageCode="null";
    }
    
    return this.httpClient.get(this.API_URL + '/'+CustomerID +'/'+SearchgrowthPersonCode + '/' + SearchEmployeeName + '/' + SearchgrowthPersonManageCode +'/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerGrowthPerson) 
  {
     debugger
    advanceTable.customerGrowthPersonID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerGrowthPerson)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerGrowthPersonid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerGrowthPersonid+ '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
