// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CreditNoteManagementService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "creditNoteHome";
  }

  /** CRUD METHODS */
  getTableData(searchCustomerName:string, searchCustomerGroup:string,searchApprovalStatus:string, SearchCreditNoteNumber:string, SearchBranch:string, SearchFromDate:string, SearchToDate:string, SearchType:string, PageNumber: number): Observable<any> {  
    if (searchCustomerName === "")
    {
      searchCustomerName = "null";
    }
    if (searchCustomerGroup === "")
    {
      searchCustomerGroup = "null";
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
    return this.httpClient.get(this.API_URL + "/" + 'GetAllCreditNoteHomeForManagement' + '/' + searchCustomerName + '/'+ searchCustomerGroup + '/'+ searchApprovalStatus + '/' + SearchCreditNoteNumber + '/' + SearchBranch + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchType + '/' + PageNumber + '/InvoiceCreditNoteID/Ascending');
  }

  getTableDataSort(searchCustomerName:string, searchCustomerGroup:string, searchApprovalStatus:string, SearchCreditNoteNumber:string, SearchBranch:string, SearchFromDate:string, SearchToDate:string, SearchType:string, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchCustomerName === "")
    {
      searchCustomerName = "null";
    }
    if (searchCustomerGroup === "")
    {
      searchCustomerGroup = "null";
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
    return this.httpClient.get(this.API_URL + "/" + 'GetAllCreditNoteHomeForManagement' + '/' + searchCustomerName + '/'+ searchCustomerGroup + '/' + searchApprovalStatus + '/' + SearchCreditNoteNumber + '/' + SearchBranch + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchType + '/' + PageNumber + '/' + coloumName + '/' + sortType);

  }

}

