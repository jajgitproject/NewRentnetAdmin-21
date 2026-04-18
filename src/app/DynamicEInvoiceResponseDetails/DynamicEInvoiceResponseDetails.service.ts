// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DynamicEInvoiceResponseDetailsService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "EInvoiceDynamicApi";
  }
  /** CRUD METHODS */
   getTableData(SearchInvoiceNumber:string,SearchFromDate:string,SearchToDate:string,SearchCustomerName:string,SearchdynamicsAPIStatusCode:string,PageNumber: number): Observable<any> {  
    if (SearchInvoiceNumber === "")
    {
      SearchInvoiceNumber = "null";
    }
    if (SearchFromDate === "")
    {
      SearchFromDate = "null";
    }
    if (SearchToDate === "")
    {
      SearchToDate = "null";
    }
    if (SearchCustomerName === "")
    {
      SearchCustomerName = "null";
    }
    if (SearchdynamicsAPIStatusCode === "")
    {
      SearchdynamicsAPIStatusCode = "null";
    }
    return this.httpClient.get(this.API_URL + '/InvoiceSearch' + "/" + SearchInvoiceNumber + '/'+ SearchFromDate + '/' + SearchToDate + '/'+ SearchCustomerName + '/' + SearchdynamicsAPIStatusCode + '/' + PageNumber + '/DynamicsAPICallID/Ascending');
  }


  getTableDataSort(SearchdynamicEInvoiceDetails:string, SearchActivationStatus:string, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchdynamicEInvoiceDetails==="")
    {
      SearchdynamicEInvoiceDetails="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus="null";
    }
    return this.httpClient.get(this.API_URL + "/" +SearchdynamicEInvoiceDetails + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  

  delete(reservationdynamicEInvoiceID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ reservationdynamicEInvoiceID + '/'+ userID);
  }

}
  

