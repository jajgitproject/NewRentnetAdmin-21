// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerCategory } from './customerCategory.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerCategoryService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerCategory";
  }
  /** CRUD METHODS */
  getTableData(SearchCustomerCategory:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerCategory==="")
    {
      SearchCustomerCategory="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
     return this.httpClient.get(this.API_URL + "/" +SearchCustomerCategory + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerCategoryID/Ascending');
  }
  getTableDataSort(SearchCustomerCategory:string, SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCustomerCategory==="")
    {
      SearchCustomerCategory="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerCategory + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerCategory) 
  {
    advanceTable.customerCategoryID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerCategory)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerCategoryID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerCategoryID + '/'+ userID);
  }

}
  

