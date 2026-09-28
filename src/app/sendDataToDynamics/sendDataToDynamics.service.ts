// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';

@Injectable()
export class SendDataToDynamicsService {
  private API_URL = '';
  private DYNAMICS_API_URL = '';
  private BATCH_API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.DYNAMICS_API_URL = generalService.BaseURL + 'DynamicsAPI';
    this.BATCH_API_URL = generalService.BaseURL + 'DynamicsSyncBatch';
    this.API_URL = this.DYNAMICS_API_URL + '/GetAllInvoices';
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
    return this.toRouteParam(text.replace(/,/g, '~'));
  }

  private toGstCategoryRouteParam(value: any): string {
    const text = String(value || '').trim();
    if (text === '' || text === 'Both' || text === 'All') {
      return 'null';
    }
    return this.toRouteParam(text);
  }

  private toInvoiceTypeRouteParam(value: any): string {
    const text = String(value || '').trim();
    if (text === '' || text === 'All') {
      return 'null';
    }
    return this.toRouteParam(text);
  }

  private buildSearchUrl(
    searchGstCategory: string,
    searchInvoiceType: string,
    searchCustomerName: string,
    searchCustomerGroup: string,
    searchInvoiceNo: string,
    searchBranch: string,
    searchFromDate: string,
    searchToDate: string,
    searchInvoiceSyncStatus: string,
    searchEInvoice: string,
    searchDutySlip: string,
    searchReservationID: string,
    searchActivationStatus: boolean,
    pageNumber: number,
    orderByColumn: string,
    sortType: string
  ): string {
    return this.API_URL
      + '/' + this.toGstCategoryRouteParam(searchGstCategory)
      + '/' + this.toInvoiceTypeRouteParam(searchInvoiceType)
      + '/' + this.toRouteParam(searchCustomerName)
      + '/' + this.toRouteParam(searchCustomerGroup)
      + '/' + this.toInvoiceRouteParam(searchInvoiceNo)
      + '/' + this.toRouteParam(searchBranch)
      + '/' + this.toRouteParam(searchFromDate)
      + '/' + this.toRouteParam(searchToDate)
      + '/' + this.toRouteParam(searchInvoiceSyncStatus)
      + '/' + this.toRouteParam(searchEInvoice)
      + '/' + this.toIdRouteParam(searchDutySlip)
      + '/' + this.toIdRouteParam(searchReservationID)
      + '/' + this.toRouteParam(searchActivationStatus)
      + '/' + pageNumber
      + '/' + encodeURIComponent(orderByColumn)
      + '/' + encodeURIComponent(sortType);
  }

  getTableData(
    searchGstCategory: string,
    searchInvoiceType: string,
    searchCustomerName: string,
    searchCustomerGroup: string,
    searchInvoiceNo: string,
    searchBranch: string,
    searchFromDate: string,
    searchToDate: string,
    searchInvoiceSyncStatus: string,
    searchEInvoice: string,
    searchDutySlip: string,
    searchReservationID: string,
    searchActivationStatus: boolean,
    pageNumber: number
  ): Observable<any> {
    return this.httpClient.get(this.buildSearchUrl(
      searchGstCategory,
      searchInvoiceType,
      searchCustomerName,
      searchCustomerGroup,
      searchInvoiceNo,
      searchBranch,
      searchFromDate,
      searchToDate,
      searchInvoiceSyncStatus,
      searchEInvoice,
      searchDutySlip,
      searchReservationID,
      searchActivationStatus,
      pageNumber,
      'InvoiceID',
      'Descending'
    ));
  }

  getTableDataSort(
    searchGstCategory: string,
    searchInvoiceType: string,
    searchCustomerName: string,
    searchCustomerGroup: string,
    searchInvoiceNo: string,
    searchBranch: string,
    searchFromDate: string,
    searchToDate: string,
    searchInvoiceSyncStatus: string,
    searchEInvoice: string,
    searchDutySlip: string,
    searchReservationID: string,
    searchActivationStatus: boolean,
    pageNumber: number,
    columnName: string,
    sortType: string
  ): Observable<any> {
    return this.httpClient.get(this.buildSearchUrl(
      searchGstCategory,
      searchInvoiceType,
      searchCustomerName,
      searchCustomerGroup,
      searchInvoiceNo,
      searchBranch,
      searchFromDate,
      searchToDate,
      searchInvoiceSyncStatus,
      searchEInvoice,
      searchDutySlip,
      searchReservationID,
      searchActivationStatus,
      pageNumber,
      columnName,
      sortType
    ));
  }

  sendInvoicesToDynamics(invoiceIds: number[], batchCreatedById: number): Observable<any> {
    return this.httpClient.post(`${this.BATCH_API_URL}/start`, {
      invoiceIds,
      batchCreatedByID: batchCreatedById
    });
  }
}
