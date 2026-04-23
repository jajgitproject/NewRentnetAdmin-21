// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { GenerateEInvoiceModel } from './generateEInvoice.model';
@Injectable()
export class GenerateEInvoiceService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "EInvoice";
  }

  /** CRUD METHODS */
  getTableData(SearchInvoiceNumber:string,SearchFromDate:string,SearchToDate:string,SearchCustomerName:string,SearchIRNStatus:string,PageNumber: number): Observable<any> {  
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
    if (SearchIRNStatus === "")
    {
      SearchIRNStatus = "null";
    }
    return this.httpClient.get(this.API_URL + '/InvoiceSearch' + "/" + SearchInvoiceNumber + '/'+ SearchFromDate + '/' + SearchToDate + '/'+ SearchCustomerName + '/' + SearchIRNStatus + '/' + PageNumber + '/InvoiceID/Descending');
  }

  getTableDataSort(SearchInvoiceNumber:string,SearchFromDate:string,SearchToDate:string,SearchCustomerName:string,SearchIRNStatus:string,PageNumber: number, coloumName: string, sortType: string): Observable<any> {
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
    if (SearchIRNStatus === "")
    {
      SearchIRNStatus = "null";
    }
    return this.httpClient.get(this.API_URL + '/InvoiceSearch' + "/" + SearchInvoiceNumber + '/'+ SearchFromDate + '/' + SearchToDate + '/' + SearchCustomerName + '/' + SearchIRNStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  add(advanceTable: GenerateEInvoiceModel) 
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + '/CancelIRN/', advanceTable);
  }

  generateEInvoice(advanceTable: GenerateEInvoiceModel) 
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + '/GenerateIRN/', advanceTable);
  }

  viewEInvoice(irn: string) 
  {
    return this.httpClient.get(this.API_URL + '/ViewEInvoice/' + irn, {
      responseType: 'blob'
    });
  }


}
