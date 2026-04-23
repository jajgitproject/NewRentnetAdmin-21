// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class InvoiceHomeService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "invoiceHome";
  }

  /** CRUD METHODS */
  getTableData(searchCustomerName: string,
    searchCustomerGroup: string,
    searchInvoiceNo: string,
    searchBranch: string,
    searchFromDate: string,
    searchToDate: string,
    SearchInvoiceStatus: string,
    SearchEInvoice:string,
     searchDutySlip: string,
      searchReservationID: string,
    searchActivationStatus: boolean,
    PageNumber: number): Observable<any> {
    if (searchCustomerName === "") {
      searchCustomerName = null;
    }
    if (searchCustomerGroup === "") {
      searchCustomerGroup = null;
    }
    if (searchInvoiceNo === "") {
      searchInvoiceNo = null;
    }

    if (searchBranch === "") {
      searchBranch = null;
    }
    if (searchFromDate === "") {
      searchFromDate = null;
    }
    if (searchToDate === "") {
      searchToDate = null;
    }
    if (SearchInvoiceStatus === "") {
      SearchInvoiceStatus = null;
    }
    if (SearchEInvoice === "") {
      SearchEInvoice = null;
    }
     if (searchDutySlip === "") {
      searchDutySlip = "null";
    }
     if (searchReservationID === "") {
      searchReservationID = "null";
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + searchCustomerName + '/' + searchCustomerGroup + '/' + searchInvoiceNo + '/' + searchBranch + '/' + searchFromDate + '/' + searchToDate + '/' + SearchInvoiceStatus + '/' + SearchEInvoice + '/'+ searchDutySlip + '/'+ searchReservationID + '/' + searchActivationStatus + '/' + PageNumber + '/InvoiceID/Descending');

  }

  getTableDataSort(
    searchCustomerName: string,
    searchCustomerGroup: string,
    searchInvoiceNo: string,
    searchBranch: string,
    searchFromDate: string,
    searchToDate: string,
    SearchInvoiceStatus: string,
    SearchEInvoice:string,
     searchDutySlip: string,
      searchReservationID: string,
    searchActivationStatus: boolean,
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
     if (searchCustomerName === "") {
      searchCustomerName = null;
    }
    if (searchCustomerGroup === "") {
      searchCustomerGroup = null;
    }
    if (searchInvoiceNo === "") {
      searchInvoiceNo = null;
    }
    if (searchBranch === "") {
      searchBranch = null;
    }
    if (searchFromDate === "") {
      searchFromDate = null;
    }
    if (searchToDate === "") {
      searchToDate = null;
    }
    if (SearchInvoiceStatus === "") {
      SearchInvoiceStatus = null;
    }
    if (SearchEInvoice === "") {
      SearchEInvoice = null;
    }
     if (searchDutySlip === "") {
      searchDutySlip = "null";
    }
     if (searchReservationID === "") {
      searchReservationID = "null";
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchCustomerName + '/' + searchCustomerGroup + '/' + searchInvoiceNo + '/' + searchBranch + '/' + searchFromDate + '/' + searchToDate + '/' + SearchInvoiceStatus + '/' + SearchEInvoice + '/'+ searchDutySlip + '/'+ searchReservationID + '/' + searchActivationStatus + '/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

}
