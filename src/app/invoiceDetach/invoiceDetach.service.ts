// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { InvoiceDutyAttachmentModel } from './invoiceDetach.model';
@Injectable()
export class InvoiceDetachService {
  private API_URL: string = '';
  private API_URL_Post: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "invoiceAttachDetach";
    this.API_URL_Post = generalService.BaseURL + "invoiceDutyAttachment";
  }

  /** CRUD METHODS */
  add(advanceTable: InvoiceDutyAttachmentModel) 
  {
    //advanceTable.invoiceID=0;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL_Post , advanceTable);  
  }

  getTableData(SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number): Observable<any> {  
    if (SearchCustomerName === "")
    {
      SearchCustomerName = "null";
    }
    if (SearchBranch === "")
    {
      SearchBranch = "null";
    }
    if (SearchDutySlipID === null || SearchDutySlipID === undefined)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null || SearchReservationID === undefined)
    {
      SearchReservationID = 0;
    }    
    if (SearchGSTType === "")
    {
      SearchGSTType = "null";
    }
    if (SearchDutyFromDate === "")
    {
      SearchDutyFromDate = "null";
    }
    if (SearchDutyToDate === "")
    {
      SearchDutyToDate = "null";
    }
    if (SearchPassengerName === "")
    {
      SearchPassengerName = "null";
    }
    if (SearchPassengerMobile === "")
    {
      SearchPassengerMobile = "null";
    }
    if (SearchPackageType === "")
    {
      SearchPackageType = "null";
    }
    if (SearchPackage === "")
    {
      SearchPackage = "null";
    }
    if (SearchDSStatus === "")
    {
      SearchDSStatus = "null";
    }
    if (SearchBillingStatus === null || SearchBillingStatus === undefined)
    {
      SearchBillingStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + 'GetAllInvoiceDetach' + '/' + SearchCustomerName + '/'+ SearchBranch + '/' + SearchDutySlipID + '/' + SearchReservationID + '/' + SearchGSTType + '/' + SearchDutyFromDate + '/' + SearchDutyToDate + '/' + SearchPassengerName + '/' + SearchPassengerMobile + '/' + SearchPackageType + '/' + SearchPackage + '/' + SearchDSStatus + '/' + SearchBillingStatus + '/' + PageNumber + '/DutySlipID/Descending');
  }

  getTableDataSort(SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (SearchCustomerName === "")
    {
      SearchCustomerName = "null";
    }
    if (SearchBranch === "")
    {
      SearchBranch = "null";
    }
    if (SearchDutySlipID === null)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null)
    {
      SearchReservationID = 0;
    }    
    if (SearchGSTType === "")
    {
      SearchGSTType = "null";
    }
    if (SearchDutyFromDate === "")
    {
      SearchDutyFromDate = "null";
    }
    if (SearchDutyToDate === "")
    {
      SearchDutyToDate = "null";
    }
    if (SearchPassengerName === "")
    {
      SearchPassengerName = "null";
    }
    if (SearchPassengerMobile === "")
    {
      SearchPassengerMobile = "null";
    }
    if (SearchPackageType === "")
    {
      SearchPackageType = "null";
    }
    if (SearchPackage === "")
    {
      SearchPackage = "null";
    }
    if (SearchDSStatus === "")
    {
      SearchDSStatus = "null";
    }
    if (SearchBillingStatus === null || SearchBillingStatus === undefined)
    {
      SearchBillingStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + 'GetAllInvoiceDetach' + '/' + SearchCustomerName + '/'+ SearchBranch + '/' + SearchDutySlipID + '/' + SearchReservationID + '/' + SearchGSTType + '/' + SearchDutyFromDate + '/' + SearchDutyToDate + '/' + SearchPassengerName + '/' + SearchPassengerMobile + '/' + SearchPackageType + '/' + SearchPackage + '/' + SearchDSStatus + '/' + SearchBillingStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

 //---------- Edit ----------
  getTableDataForEdit(SearchInvoiceNumberWithPrefix:string,SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number): Observable<any> {  
    if (SearchInvoiceNumberWithPrefix === "")
    {
      SearchInvoiceNumberWithPrefix = "null";
    }
    if (SearchCustomerName === "")
    {
      SearchCustomerName = "null";
    }
    if (SearchBranch === "")
    {
      SearchBranch = "null";
    }
    if (SearchDutySlipID === null || SearchDutySlipID === undefined)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null || SearchReservationID === undefined)
    {
      SearchReservationID = 0;
    }    
    if (SearchGSTType === "")
    {
      SearchGSTType = "null";
    }
    if (SearchDutyFromDate === "")
    {
      SearchDutyFromDate = "null";
    }
    if (SearchDutyToDate === "")
    {
      SearchDutyToDate = "null";
    }
    if (SearchPassengerName === "")
    {
      SearchPassengerName = "null";
    }
    if (SearchPassengerMobile === "")
    {
      SearchPassengerMobile = "null";
    }
    if (SearchPackageType === "")
    {
      SearchPackageType = "null";
    }
    if (SearchPackage === "")
    {
      SearchPackage = "null";
    }
    if (SearchDSStatus === "")
    {
      SearchDSStatus = "null";
    }
    if (SearchBillingStatus === null || SearchBillingStatus === undefined)
    {
      SearchBillingStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + 'GetAllInvoiceDetachForEdit' + '/' + SearchInvoiceNumberWithPrefix + '/' + SearchCustomerName + '/'+ SearchBranch + '/' + SearchDutySlipID + '/' + SearchReservationID + '/' + SearchGSTType + '/' + SearchDutyFromDate + '/' + SearchDutyToDate + '/' + SearchPassengerName + '/' + SearchPassengerMobile + '/' + SearchPackageType + '/' + SearchPackage + '/' + SearchDSStatus + '/' + SearchBillingStatus + '/' + PageNumber + '/DutySlipID/Descending');
  }

  getTableDataSortForEdit(SearchInvoiceNumberWithPrefix:string,SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (SearchInvoiceNumberWithPrefix === "")
    {
      SearchInvoiceNumberWithPrefix = "null";
    }
    if (SearchCustomerName === "")
    {
      SearchCustomerName = "null";
    }
    if (SearchBranch === "")
    {
      SearchBranch = "null";
    }
    if (SearchDutySlipID === null)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null)
    {
      SearchReservationID = 0;
    }    
    if (SearchGSTType === "")
    {
      SearchGSTType = "null";
    }
    if (SearchDutyFromDate === "")
    {
      SearchDutyFromDate = "null";
    }
    if (SearchDutyToDate === "")
    {
      SearchDutyToDate = "null";
    }
    if (SearchPassengerName === "")
    {
      SearchPassengerName = "null";
    }
    if (SearchPassengerMobile === "")
    {
      SearchPassengerMobile = "null";
    }
    if (SearchPackageType === "")
    {
      SearchPackageType = "null";
    }
    if (SearchPackage === "")
    {
      SearchPackage = "null";
    }
    if (SearchDSStatus === "")
    {
      SearchDSStatus = "null";
    }
    if (SearchBillingStatus === null || SearchBillingStatus === undefined)
    {
      SearchBillingStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + 'GetAllInvoiceDetachForEdit' + '/' + SearchInvoiceNumberWithPrefix + '/' + SearchCustomerName + '/'+ SearchBranch + '/' + SearchDutySlipID + '/' + SearchReservationID + '/' + SearchGSTType + '/' + SearchDutyFromDate + '/' + SearchDutyToDate + '/' + SearchPassengerName + '/' + SearchPassengerMobile + '/' + SearchPackageType + '/' + SearchPackage + '/' + SearchDSStatus + '/' + SearchBillingStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

}
