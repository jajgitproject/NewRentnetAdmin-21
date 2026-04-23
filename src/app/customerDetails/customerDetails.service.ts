// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerDetails } from './customerDetails.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerDetails";
  }
  /** CRUD METHODS */
  getTableData(SearchCustomerDetails:string, SearchActivationStatus:string, PageNumber: number):  Observable<any> 
  {
    if(SearchCustomerDetails==="")
    {
      SearchCustomerDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerDetails/Ascending');
  }
  getTableDataSort(SearchCustomerDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string ):  Observable<any> 
  {
    if(SearchCustomerDetails==="")
    {
      SearchCustomerDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchCustomerDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerDetails) 
  {
    advanceTable.customerDetailsID=-1;
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerDetails)
  {
    advanceTable.updatedBy=this.generalService.getUserID();
    advanceTable.updateDateTime= this.generalService.getTodaysDate();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerDetailsID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ customerDetailsID);
  }

  
}
  

