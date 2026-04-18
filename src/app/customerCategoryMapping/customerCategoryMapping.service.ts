// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerCategoryMapping } from './customerCategoryMapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerCategoryMappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerCategoryMapping";
  }
  /** CRUD METHODS */
  getTableData(customerID:number,searchCustomerCategory:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(searchCustomerCategory==="")
    {
      searchCustomerCategory="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchCustomerCategory + '/'+ SearchActivationStatus +'/' + PageNumber + '/customerCategoryMappingID/Ascending');
  }
  getTableDataSort(customerID:number,searchCustomerCategory:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(searchCustomerCategory==="")
    {
      searchCustomerCategory="null";
    }
    if(customerID===0)
    {
      customerID=0;
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +customerID + '/'+searchCustomerCategory + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerCategoryMapping) 
  {
    advanceTable.customerCategoryMappingID=-1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerCategoryMapping)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerCategoryMappingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerCategoryMappingID+ '/'+ userID);
  }
}
