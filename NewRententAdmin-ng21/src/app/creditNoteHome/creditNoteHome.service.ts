// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CreditNoteHomeModel } from './creditNoteHome.model';
@Injectable()
export class CreditNoteHomeService {
  private API_URL: string = '';
  private API_URL_Generate_Cancel: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "creditNoteHome";
    this.API_URL_Generate_Cancel = generalService.BaseURL + "EInvoice";
  }

  /** CRUD METHODS */
  getTableData(searchCustomerName:string, searchCustomerGroup:string,SearchBillNo:string,searchApprovalStatus:string, SearchCreditNoteNumber:string, 
    SearchBranch:string, SearchFromDate:string, SearchToDate:string, SearchType:string, PageNumber: number): Observable<any> {  
    if (searchCustomerName === "")
    {
      searchCustomerName = "null";
    }
    if (searchCustomerGroup === "")
    {
      searchCustomerGroup = "null";
    }
    if (SearchBillNo === "")
    {
      SearchBillNo = "null";
    }
    if (searchApprovalStatus === "")
    {
      searchApprovalStatus = "null";
    }
    if (SearchCreditNoteNumber === "")
    {
      SearchCreditNoteNumber = "null";
    }
    if (SearchBranch === "")
    {
      SearchBranch = "null";
    }
    if (SearchFromDate === "")
    {
      SearchFromDate = "null";
    }
    if (SearchToDate === "")
    {
      SearchToDate = "null";
    }
    if (SearchType === "")
    {
      SearchType = "null";
    }
    return this.httpClient.get(this.API_URL + "/" + 'GetAllCreditNoteHome' + '/' + searchCustomerName + '/'+ searchCustomerGroup + '/' + SearchBillNo + '/'+ searchApprovalStatus + '/' + SearchCreditNoteNumber + '/' + SearchBranch + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchType + '/' + PageNumber + '/InvoiceCreditNoteID/Ascending');
  }

  getTableDataSort(searchCustomerName:string, searchCustomerGroup:string, SearchBillNo:string, searchApprovalStatus:string, SearchCreditNoteNumber:string, SearchBranch:string, SearchFromDate:string, SearchToDate:string, SearchType:string, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchCustomerName === "")
    {
      searchCustomerName = "null";
    }
    if (searchCustomerGroup === "")
    {
      searchCustomerGroup = "null";
    }
    if (SearchBillNo === "")
    {
      SearchBillNo = "null";
    }
    if (searchApprovalStatus === "")
    {
      searchApprovalStatus = "null";
    }
    if (SearchCreditNoteNumber === "")
    {
      SearchCreditNoteNumber = "null";
    }
    if (SearchBranch === "")
    {
      SearchBranch = "null";
    }
    if (SearchFromDate === "")
    {
      SearchFromDate = "null";
    }
    if (SearchToDate === "")
    {
      SearchToDate = "null";
    }
    if (SearchType === "")
    {
      SearchType = "null";
    }
    return this.httpClient.get(this.API_URL + "/" + 'GetAllCreditNoteHome' + '/' + searchCustomerName + '/'+ searchCustomerGroup + '/' + SearchBillNo + '/' + searchApprovalStatus + '/' + SearchCreditNoteNumber + '/' + SearchBranch + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchType + '/' + PageNumber + '/' + coloumName + '/' + sortType);

  }


  generateECreditNote(advanceTable: CreditNoteHomeModel) 
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL_Generate_Cancel + '/GenerateCreditNoteIRN/', advanceTable);
  }

  cancelECreditNote(advanceTable: CreditNoteHomeModel) 
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL_Generate_Cancel + '/CancelCreditNoteIRN/', advanceTable);
  }
}
