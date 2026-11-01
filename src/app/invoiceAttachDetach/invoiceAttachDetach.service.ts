// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { InvoiceBillDateContext } from './invoiceAttachDetach.model';
@Injectable()
export class InvoiceAttachDetachService {
  private API_URL: string = '';
  /** Request all matching rows (no SQL OFFSET/FETCH). */
  private readonly ALL_ROWS_PAGE = -1;
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

  private parseIdList(value: any): string[] {
    if (value === null || value === undefined) {
      return [];
    }
    const text = String(value).trim();
    if (text === '' || text === 'null' || text === '0') {
      return [];
    }
    return text.split(/[,;~\s-]+/).filter((part) => /^\d+$/.test(part) && Number(part) > 0);
  }

  private toIdRouteParam(value: any): string {
    const ids = this.parseIdList(value);
    return ids.length ? ids.join('-') : '0';
  }

  private toIdQueryValue(value: any): string {
    const ids = this.parseIdList(value);
    return ids.length ? ids.join('-') : '';
  }

  private idQueryParams(dutySlipId: any, reservationId: any): { params?: HttpParams } {
    let params = new HttpParams();
    const dutySlipIds = this.toIdQueryValue(dutySlipId);
    const reservationIds = this.toIdQueryValue(reservationId);
    if (dutySlipIds) {
      params = params.set('dutySlipIds', dutySlipIds);
    }
    if (reservationIds) {
      params = params.set('reservationIds', reservationIds);
    }
    return params.keys().length ? { params } : {};
  }

  private buildGetAllInvoiceAttachPath(
    SearchCustomerName: string, SearchBranch: string, SearchDutySlipID: string | number, SearchReservationID: string | number,
    SearchGSTType: string, SearchDutyFromDate: string, SearchDutyToDate: string, SearchPassengerName: string,
    SearchPassengerMobile: string, SearchPackageType: string, SearchPackage: string, SearchDSStatus: string,
    SearchBillingStatus: boolean, SearchVerifyDuty: boolean, SearchGoodForBilling: boolean,
    PageNumber: number, coloumName: string, sortType: string): string {
    return `${this.API_URL}/GetAllInvoiceAttach/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchBranch)}/${this.toIdRouteParam(SearchDutySlipID)}/${this.toIdRouteParam(SearchReservationID)}/${this.toRouteParam(SearchGSTType)}/${this.toRouteParam(SearchDutyFromDate)}/${this.toRouteParam(SearchDutyToDate)}/${this.toRouteParam(SearchPassengerName)}/${this.toRouteParam(SearchPassengerMobile)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPackage)}/${this.toRouteParam(SearchDSStatus)}/${this.toRouteBoolParam(SearchBillingStatus)}/${this.toRouteBoolParam(SearchVerifyDuty)}/${this.toRouteBoolParam(SearchGoodForBilling)}/${PageNumber}/${encodeURIComponent(coloumName)}/${encodeURIComponent(sortType)}`;
  }

  private buildGetAllInvoiceAttachForEditPath(
    invoiceId: number,
    SearchInvoiceNumberWithPrefix: string, SearchCustomerName: string, SearchBranch: string, SearchDutySlipID: string | number,
    SearchReservationID: string | number, SearchGSTType: string, SearchDutyFromDate: string, SearchDutyToDate: string,
    SearchPassengerName: string, SearchPassengerMobile: string, SearchPackageType: string, SearchPackage: string,
    SearchDSStatus: string, SearchBillingStatus: boolean, PageNumber: number, coloumName: string, sortType: string): string {
    const resolvedInvoiceId = invoiceId && invoiceId > 0 ? invoiceId : 0;
    return `${this.API_URL}/GetAllInvoiceAttachForEdit/${resolvedInvoiceId}/${this.toRouteParam(SearchInvoiceNumberWithPrefix)}/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchBranch)}/${this.toIdRouteParam(SearchDutySlipID)}/${this.toIdRouteParam(SearchReservationID)}/${this.toRouteParam(SearchGSTType)}/${this.toRouteParam(SearchDutyFromDate)}/${this.toRouteParam(SearchDutyToDate)}/${this.toRouteParam(SearchPassengerName)}/${this.toRouteParam(SearchPassengerMobile)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPackage)}/${this.toRouteParam(SearchDSStatus)}/${this.toRouteBoolParam(SearchBillingStatus)}/${PageNumber}/${encodeURIComponent(coloumName)}/${encodeURIComponent(sortType)}`;
  }

  /** CRUD METHODS */
  getTableData(SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:string | number, SearchReservationID:string | number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean,SearchVerifyDuty:boolean,SearchGoodForBilling:boolean,PageNumber: number): Observable<any> {  
    return this.httpClient.get(this.buildGetAllInvoiceAttachPath(
      SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType, SearchDutyFromDate,
      SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage, SearchDSStatus,
      SearchBillingStatus, SearchVerifyDuty, SearchGoodForBilling, this.ALL_ROWS_PAGE, 'DutySlipID', 'Descending'),
      this.idQueryParams(SearchDutySlipID, SearchReservationID));
  }

  getTableDataSort(SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:string | number, SearchReservationID:string | number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean,SearchVerifyDuty:boolean,SearchGoodForBilling:boolean,PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    return this.httpClient.get(this.buildGetAllInvoiceAttachPath(
      SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType, SearchDutyFromDate,
      SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage, SearchDSStatus,
      SearchBillingStatus, SearchVerifyDuty, SearchGoodForBilling, this.ALL_ROWS_PAGE, coloumName, sortType),
      this.idQueryParams(SearchDutySlipID, SearchReservationID));
  }

 //---------- Edit ----------
  getTableDataForEdit(invoiceId: number, SearchInvoiceNumberWithPrefix:string,SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:string | number, SearchReservationID:string | number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number): Observable<any> {  
    return this.httpClient.get(this.buildGetAllInvoiceAttachForEditPath(
      invoiceId, SearchInvoiceNumberWithPrefix, SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType,
      SearchDutyFromDate, SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage,
      SearchDSStatus, SearchBillingStatus, this.ALL_ROWS_PAGE, 'DutySlipID', 'Descending'),
      this.idQueryParams(SearchDutySlipID, SearchReservationID));
  }

  getTableDataSortForEdit(invoiceId: number, SearchInvoiceNumberWithPrefix:string,SearchCustomerName:string, SearchBranch:string,  SearchDutySlipID:string | number, SearchReservationID:string | number, SearchGSTType:string, SearchDutyFromDate:string, 
    SearchDutyToDate:string, SearchPassengerName:string, SearchPassengerMobile:string, SearchPackageType:string, SearchPackage:string, SearchDSStatus:string, 
    SearchBillingStatus:boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    return this.httpClient.get(this.buildGetAllInvoiceAttachForEditPath(
      invoiceId, SearchInvoiceNumberWithPrefix, SearchCustomerName, SearchBranch, SearchDutySlipID, SearchReservationID, SearchGSTType,
      SearchDutyFromDate, SearchDutyToDate, SearchPassengerName, SearchPassengerMobile, SearchPackageType, SearchPackage,
      SearchDSStatus, SearchBillingStatus, this.ALL_ROWS_PAGE, coloumName, sortType),
      this.idQueryParams(SearchDutySlipID, SearchReservationID));
  }

  getInvoiceBillDate(invoiceId: number): Observable<InvoiceBillDateContext> {
    return this.httpClient.get<InvoiceBillDateContext>(this.API_URL + '/GetInvoiceBillDate/' + invoiceId);
  }

}
