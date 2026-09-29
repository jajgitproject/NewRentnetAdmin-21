// @ts-nocheck

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { GeneralService } from '../general/general.service';



@Injectable()

export class SendCreditNotesToDynamicsService {

  private SEARCH_API_URL = '';

  private DYNAMICS_CREDIT_NOTE_API_URL = '';

  private BATCH_API_URL = '';



  constructor(private httpClient: HttpClient, public generalService: GeneralService) {

    this.DYNAMICS_CREDIT_NOTE_API_URL = generalService.BaseURL + 'DynamicsCreditNoteAPI';

    this.SEARCH_API_URL = this.DYNAMICS_CREDIT_NOTE_API_URL + '/GetAllCreditNotes';

    this.BATCH_API_URL = generalService.BaseURL + 'DynamicsSyncBatch';

  }



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



  private toDocumentRouteParam(value: any): string {

    if (value === null || value === undefined) {

      return 'null';

    }

    const text = String(value).trim();

    if (text === '' || text === 'null') {

      return 'null';

    }

    return this.toRouteParam(text.replace(/\//g, '-'));

  }



  private buildSearchUrl(

    searchCustomerName: string,

    searchCustomerGroup: string,

    searchInvoiceNo: string,

    searchCreditNoteNo: string,

    searchBranch: string,

    searchFromDate: string,

    searchToDate: string,

    searchCreditNoteType: string,

    searchECreditNoteStatus: string,

    searchActivationStatus: boolean,

    pageNumber: number,

    orderByColumn: string,

    sortType: string

  ): string {

    return this.SEARCH_API_URL

      + '/null'

      + '/null'

      + '/' + this.toRouteParam(searchCustomerName)

      + '/' + this.toRouteParam(searchCustomerGroup)

      + '/' + this.toDocumentRouteParam(searchInvoiceNo)

      + '/' + this.toDocumentRouteParam(searchCreditNoteNo)

      + '/' + this.toRouteParam(searchBranch)

      + '/' + this.toRouteParam(searchFromDate)

      + '/' + this.toRouteParam(searchToDate)

      + '/null'

      + '/' + this.toRouteParam(searchECreditNoteStatus)

      + '/' + this.toRouteParam(searchCreditNoteType)

      + '/' + this.toRouteParam(searchActivationStatus)

      + '/' + pageNumber

      + '/' + encodeURIComponent(orderByColumn)

      + '/' + encodeURIComponent(sortType);

  }



  getTableData(

    searchCustomerName: string,

    searchCustomerGroup: string,

    searchInvoiceNo: string,

    searchCreditNoteNo: string,

    searchBranch: string,

    searchFromDate: string,

    searchToDate: string,

    searchCreditNoteType: string,

    searchECreditNoteStatus: string,

    searchActivationStatus: boolean,

    pageNumber: number

  ): Observable<any> {

    return this.httpClient.get(this.buildSearchUrl(

      searchCustomerName,

      searchCustomerGroup,

      searchInvoiceNo,

      searchCreditNoteNo,

      searchBranch,

      searchFromDate,

      searchToDate,

      searchCreditNoteType,

      searchECreditNoteStatus,

      searchActivationStatus,

      pageNumber,

      'InvoiceCreditNoteID',

      'Descending'

    ));

  }



  getTableDataSort(

    searchCustomerName: string,

    searchCustomerGroup: string,

    searchInvoiceNo: string,

    searchCreditNoteNo: string,

    searchBranch: string,

    searchFromDate: string,

    searchToDate: string,

    searchCreditNoteType: string,

    searchECreditNoteStatus: string,

    searchActivationStatus: boolean,

    pageNumber: number,

    columnName: string,

    sortType: string

  ): Observable<any> {

    return this.httpClient.get(this.buildSearchUrl(

      searchCustomerName,

      searchCustomerGroup,

      searchInvoiceNo,

      searchCreditNoteNo,

      searchBranch,

      searchFromDate,

      searchToDate,

      searchCreditNoteType,

      searchECreditNoteStatus,

      searchActivationStatus,

      pageNumber,

      columnName,

      sortType

    ));

  }



  sendCreditNoteToDynamics(creditNoteNumberWithPrefix: string): Observable<any> {

    const routeValue = this.toDocumentRouteParam(creditNoteNumberWithPrefix);

    return this.httpClient.get(`${this.DYNAMICS_CREDIT_NOTE_API_URL}/SendCreditNoteToDynamicsAPI/${routeValue}`);

  }

  sendCreditNotesToDynamics(invoiceCreditNoteIds: number[], batchCreatedById: number): Observable<any> {

    return this.httpClient.post(`${this.BATCH_API_URL}/startCreditNotes`, {

      invoiceCreditNoteIds,

      batchCreatedByID: batchCreatedById

    });

  }

  getCreditNoteDynamicsSyncDetails(invoiceCreditNoteId: number): Observable<any> {

    return this.httpClient.get(`${this.DYNAMICS_CREDIT_NOTE_API_URL}/GetCreditNoteDynamicsSyncDetails/${invoiceCreditNoteId}`);

  }

}

