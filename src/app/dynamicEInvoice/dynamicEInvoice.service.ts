// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DynamicEInvoiceModel } from './dynamicEInvoice.model';
@Injectable()
export class DynamicEInvoiceService {
  private API_URL: string = '';
  private API_URL_Dynamics: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "EInvoiceDynamicApi";
    this.API_URL_Dynamics = generalService.BaseURL + "DynamicsAPI";
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

  getTableDataSort(SearchInvoiceNumber:string,SearchFromDate:string,SearchToDate:string,SearchCustomerName:string,SearchdynamicsAPIStatusCode:string,PageNumber: number, coloumName: string, sortType: string): Observable<any> {
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
    return this.httpClient.get(this.API_URL + '/InvoiceSearch' + "/" + SearchInvoiceNumber + '/'+ SearchFromDate + '/' + SearchToDate + '/'+ SearchCustomerName + '/' + SearchdynamicsAPIStatusCode + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  add(advanceTable: DynamicEInvoiceModel) 
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + '/CancelIRN/', advanceTable);
  }

  dynamicsResendData(InvoiceID: number) 
  {
    
    return this.httpClient.get<any>(this.API_URL_Dynamics + '/SendInvoiceToDynamicsAPI/'+ InvoiceID);
  }

  viewEInvoice(irn: string) 
  {
    return this.httpClient.get(this.API_URL + '/ViewEInvoice/' + irn, {
      responseType: 'blob'
    });
  }


}
