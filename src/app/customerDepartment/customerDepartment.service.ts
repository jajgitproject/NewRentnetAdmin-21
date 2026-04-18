// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerDepartment } from './customerDepartment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerDepartmentService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerDepartment";
  }
  /** CRUD METHODS */
  getTableData(customerGroupID:number,searchCustomerDepartment:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchCustomerDepartment==="")
    {
      searchCustomerDepartment="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/"  +customerGroupID + '/'+searchCustomerDepartment + '/' + SearchActivationStatus +'/' + PageNumber + '/customerDepartment/Ascending');
  }
  getTableDataSort(customerGroupID:number,searchCustomerDepartment:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(customerGroupID===0)
    {
      customerGroupID=0;
    }
    if(searchCustomerDepartment==="")
    {
      searchCustomerDepartment="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerGroupID + '/' +searchCustomerDepartment + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerDepartment) 
  {
    advanceTable.customerDepartmentID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerDepartment)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerDepartmentID: number):  Observable<any> 
  {
    
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerDepartmentID + '/'+ userID);
  }
}
