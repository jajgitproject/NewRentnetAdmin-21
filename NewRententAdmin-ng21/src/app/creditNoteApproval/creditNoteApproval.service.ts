// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CreditNoteApproval } from './creditNoteApproval.model';
@Injectable()
export class CreditNoteApprovalService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "creditNoteApproval";
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
    return this.httpClient.get(this.API_URL + "/" + searchCustomerName + '/'+ searchCustomerGroup + '/'+ searchApprovalStatus + '/' + SearchCreditNoteNumber + '/' + SearchBranch + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchType + '/' + PageNumber + '/InvoiceCreditNoteID/Ascending');
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
    return this.httpClient.get(this.API_URL + "/" + searchCustomerName + '/'+ searchCustomerGroup + '/' + searchApprovalStatus + '/' + SearchCreditNoteNumber + '/' + SearchBranch + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchType + '/' + PageNumber + '/' + coloumName + '/' + sortType);

  }

  update(advanceTable: CreditNoteApproval)
    {
      advanceTable.userID=this.generalService.getUserID();
      advanceTable.approvalDateTimeString=this.generalService.getTimeApplicable(advanceTable.approvalDateTime);
        advanceTable.approvalDateTimeString=this.generalService.getTimeTo(advanceTable.approvalDateTime);
      advanceTable.approvedByID=this.generalService.getUserID();
      return this.httpClient.put<any>(this.API_URL , advanceTable);
    }
}
