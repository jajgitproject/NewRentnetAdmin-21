// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InvoiceAttachDetachService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "invoiceAttachDetach";
  }

  /** Encode path segment; trailing '.' before '/null' breaks ASP.NET routing (LIMITED./null). */
  private toRouteParam(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    const text = String(value).trim();
    if (text === '' || text === 'null') {
      return 'null';
    }
    if (text.startsWith('#')) {
      return encodeURIComponent(text);
    }
    let normalized = text;
    while (normalized.endsWith('.')) {
      normalized = normalized.slice(0, -1);
    }
    return encodeURIComponent(normalized).replace(/\./g, '%2E');
  }

  private toRouteBoolParam(value: boolean | null | undefined): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    return String(value);
  }

  private buildGetAllInvoiceAttachPath(
    SearchCustomerName: string, SearchBranch: string, SearchDutySlipID: number, SearchReservationID: number,
    SearchGSTType: string, SearchDutyFromDate: string, SearchDutyToDate: string, SearchPassengerName: string,
    SearchPassengerMobile: string, SearchPackageType: string, SearchPackage: string, SearchDSStatus: string,
    SearchBillingStatus: boolean, SearchVerifyDuty: boolean, SearchGoodForBilling: boolean,
    PageNumber: number, coloumName: string, sortType: string): string {
    return `${this.API_URL}/GetAllInvoiceAttach/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchBranch)}/${SearchDutySlipID}/${SearchReservationID}/${this.toRouteParam(SearchGSTType)}/${this.toRouteParam(SearchDutyFromDate)}/${this.toRouteParam(SearchDutyToDate)}/${this.toRouteParam(SearchPassengerName)}/${this.toRouteParam(SearchPassengerMobile)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPackage)}/${this.toRouteParam(SearchDSStatus)}/${this.toRouteBoolParam(SearchBillingStatus)}/${this.toRouteBoolParam(SearchVerifyDuty)}/${this.toRouteBoolParam(SearchGoodForBilling)}/${PageNumber}/${encodeURIComponent(coloumName)}/${encodeURIComponent(sortType)}`;
  }

  private buildGetAllInvoiceAttachForEditPath(
    SearchInvoiceNumberWithPrefix: string, SearchCustomerName: string, SearchBranch: string, SearchDutySlipID: number,
    SearchReservationID: number, SearchGSTType: string, SearchDutyFromDate: string, SearchDutyToDate: string,
    SearchPassengerName: string, SearchPassengerMobile: string, SearchPackageType: string, SearchPackage: string,
    SearchDSStatus: string, SearchBillingStatus: boolean, PageNumber: number, coloumName: string, sortType: string): string {
    return `${this.API_URL}/GetAllInvoiceAttachForEdit/${this.toRouteParam(SearchInvoiceNumberWithPrefix)}/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchBranch)}/${SearchDutySlipID}/${SearchReservationID}/${this.toRouteParam(SearchGSTType)}/${this.toRouteParam(SearchDutyFromDate)}/${this.toRouteParam(SearchDutyToDate)}/${this.toRouteParam(SearchPassengerName)}/${this.toRouteParam(SearchPassengerMobile)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPackage)}/${this.toRouteParam(SearchDSStatus)}/${this.toRouteBoolParam(SearchBillingStatus)}/${PageNumber}/${encodeURIComponent(coloumName)}/${encodeURIComponent(sortType)}`;
  }

  /** CRUD METHODS */
  getTableData(SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean,SearchVerifyDuty:boolean,SearchGoodForBilling:boolean,PageNumber: number): Observable<any> {  
    if (SearchDutySlipID === null || SearchDutySlipID === undefined)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null || SearchReservationID === undefined)
    {
      SearchReservationID = 0;
    }
    return this.httpClient.get(this.buildGetAllInvoiceAttachPath(
      SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType, SearchDutyFromDate,
      SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage, SearchDSStatus,
      SearchBillingStatus, SearchVerifyDuty, SearchGoodForBilling, PageNumber, 'DutySlipID', 'Descending'));
  }

  getTableDataSort(SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean,SearchVerifyDuty:boolean,SearchGoodForBilling:boolean,PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (SearchDutySlipID === null)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null)
    {
      SearchReservationID = 0;
    }
    return this.httpClient.get(this.buildGetAllInvoiceAttachPath(
      SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType, SearchDutyFromDate,
      SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage, SearchDSStatus,
      SearchBillingStatus, SearchVerifyDuty, SearchGoodForBilling, PageNumber, coloumName, sortType));
  }

 //---------- Edit ----------
  getTableDataForEdit(SearchInvoiceNumberWithPrefix:string,SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number): Observable<any> {  
    if (SearchDutySlipID === null || SearchDutySlipID === undefined)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null || SearchReservationID === undefined)
    {
      SearchReservationID = 0;
    }
    return this.httpClient.get(this.buildGetAllInvoiceAttachForEditPath(
      SearchInvoiceNumberWithPrefix, SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType,
      SearchDutyFromDate, SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage,
      SearchDSStatus, SearchBillingStatus, PageNumber, 'DutySlipID', 'Descending'));
  }

  getTableDataSortForEdit(SearchInvoiceNumberWithPrefix:string,SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:number, SearchReservationID:number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (SearchDutySlipID === null)
    {
      SearchDutySlipID = 0;
    }
    if (SearchReservationID === null)
    {
      SearchReservationID = 0;
    }
    return this.httpClient.get(this.buildGetAllInvoiceAttachForEditPath(
      SearchInvoiceNumberWithPrefix, SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType,
      SearchDutyFromDate, SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage,
      SearchDSStatus, SearchBillingStatus, PageNumber, coloumName, sortType));
  }

  getInvoiceBillDate(invoiceId: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/GetInvoiceBillDate/' + invoiceId);
  }

}
