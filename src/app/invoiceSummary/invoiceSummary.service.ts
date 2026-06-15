import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceSummary } from './invoiceSummary.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { StatesDropDown } from '../organizationalEntity/stateDropDown.model';

@Injectable()
export class InvoiceSummaryService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'invoiceSummary';
  }

  getTableData(
    searchBillSubmittedTo: string,
    searchSummaryDispatchStatus: string,
    searchActivationStatus: boolean,
    pageNumber: number
  ): Observable<any> {
    if (searchBillSubmittedTo === '') {
      searchBillSubmittedTo = 'null';
    }
    if (searchSummaryDispatchStatus === '' || searchSummaryDispatchStatus === null) {
      searchSummaryDispatchStatus = 'null';
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(
      this.API_URL +
        '/' +
        searchBillSubmittedTo +
        '/' +
        searchSummaryDispatchStatus +
        '/' +
        searchActivationStatus +
        '/' +
        pageNumber +
        '/InvoiceSummaryID/Descending'
    );
  }

  getTableDataSort(
    searchBillSubmittedTo: string,
    searchSummaryDispatchStatus: string,
    searchActivationStatus: boolean,
    pageNumber: number,
    columnName: string,
    sortType: string
  ): Observable<any> {
    if (searchBillSubmittedTo === '') {
      searchBillSubmittedTo = 'null';
    }
    if (searchSummaryDispatchStatus === '' || searchSummaryDispatchStatus === null) {
      searchSummaryDispatchStatus = 'null';
    }
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(
      this.API_URL +
        '/' +
        searchBillSubmittedTo +
        '/' +
        searchSummaryDispatchStatus +
        '/' +
        searchActivationStatus +
        '/' +
        pageNumber +
        '/' +
        columnName +
        '/' +
        sortType
    );
  }

  add(advanceTable: InvoiceSummary) {
    advanceTable.invoiceSummaryID = -1;
    advanceTable.createdByID = this.generalService.getUserID();
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: InvoiceSummary) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(invoiceSummaryID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + invoiceSummaryID + '/' + userID);
  }


  GetStateBasedOnCustomerForInvoiceSummary(CustomerID: any,Prefix:any): Observable<StatesDropDown[]> 
  {
    return this.httpClient.get<StatesDropDown[]>(this.API_URL + "/GetStateBasedOnCustomerForInvoiceSummary" + "/" + CustomerID + "/" + Prefix);   
  }

}
