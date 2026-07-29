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

  private DOCUMENT_API_URL = '';



  constructor(private httpClient: HttpClient, public generalService: GeneralService) {

    this.API_URL = generalService.BaseURL + "invoiceHome";

    this.DOCUMENT_API_URL = generalService.BaseURL + 'documentManagement';

  }



  /** Encode path segment; trailing '.' before '/null' breaks ASP.NET routing. */

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



  /** Invoice numbers use '/' in DB; route segments use '-' instead. */

  private toInvoiceRouteParam(value: any): string {

    if (value === null || value === undefined) {

      return 'null';

    }

    const text = String(value).trim();

    if (text === '' || text === 'null') {

      return 'null';

    }

    return this.toRouteParam(text.replace(/\//g, '-'));

  }



  private toIdRouteParam(value: string): string {

    if (value === null || value === undefined) {

      return 'null';

    }

    const text = String(value).trim();

    if (text === '' || text === 'null') {

      return 'null';

    }

    // Use '~' in the URL path; commas can break ASP.NET route matching even when encoded.

    return this.toRouteParam(text.replace(/,/g, '~'));

  }



  private buildSearchUrl(

    searchInvoiceType: string,

    searchCustomerName: string,

    searchCustomerGroup: string,

    searchInvoiceNo: string,

    searchBranch: string,

    searchFromDate: string,

    searchToDate: string,

    SearchInvoiceStatus: string,

    SearchEInvoice: string,

    searchDutySlip: string,

    searchReservationID: string,

    searchActivationStatus: boolean,

    PageNumber: number,

    orderByColumn: string,

    sortType: string

  ): string {

    return this.API_URL

      + '/' + this.toRouteParam(searchInvoiceType)

      + '/' + this.toRouteParam(searchCustomerName)

      + '/' + this.toRouteParam(searchCustomerGroup)

      + '/' + this.toInvoiceRouteParam(searchInvoiceNo)

      + '/' + this.toRouteParam(searchBranch)

      + '/' + this.toRouteParam(searchFromDate)

      + '/' + this.toRouteParam(searchToDate)

      + '/' + this.toRouteParam(SearchInvoiceStatus)

      + '/' + this.toRouteParam(SearchEInvoice)

      + '/' + this.toIdRouteParam(searchDutySlip)

      + '/' + this.toIdRouteParam(searchReservationID)

      + '/' + this.toRouteParam(searchActivationStatus)

      + '/' + PageNumber

      + '/' + encodeURIComponent(orderByColumn)

      + '/' + encodeURIComponent(sortType);

  }



  /** CRUD METHODS */

  getTableData(searchInvoiceType: string,

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

    PageNumber: number): Observable<any> {

    return this.httpClient.get(this.buildSearchUrl(

      searchInvoiceType,

      searchCustomerName,

      searchCustomerGroup,

      searchInvoiceNo,

      searchBranch,

      searchFromDate,

      searchToDate,

      SearchInvoiceStatus,

      SearchEInvoice,

      searchDutySlip,

      searchReservationID,

      searchActivationStatus,

      PageNumber,

      'InvoiceID',

      'Descending'

    ));

  }



  getTableDataSort(

    searchInvoiceType: string,

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

    return this.httpClient.get(this.buildSearchUrl(

      searchInvoiceType,

      searchCustomerName,

      searchCustomerGroup,

      searchInvoiceNo,

      searchBranch,

      searchFromDate,

      searchToDate,

      SearchInvoiceStatus,

      SearchEInvoice,

      searchDutySlip,

      searchReservationID,

      searchActivationStatus,

      PageNumber,

      coloumName,

      sortType

    ));

  }



  archiveDocuments(invoiceId: number, performedBy: number): Observable<any> {

    return this.httpClient.post(

      `${this.DOCUMENT_API_URL}/invoice/${invoiceId}/archive-documents/${performedBy}`,

      {}

    );

  }



}


