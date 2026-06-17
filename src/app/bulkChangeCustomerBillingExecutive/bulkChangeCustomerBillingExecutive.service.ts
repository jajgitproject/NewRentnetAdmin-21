// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { BulkChangeCustomerBillingExecutiveRequest } from './bulkChangeCustomerBillingExecutive.model';

@Injectable()
export class BulkChangeCustomerBillingExecutiveService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'bulkChangeCustomerBillingExecutive';
  }

  getTableData(employeeID: number, pageNumber: number): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' + employeeID + '/' + pageNumber + '/CustomerBillingExecutiveID/Ascending'
    );
  }

  getTableDataSort(employeeID: number, pageNumber: number, columnName: string, sortType: string): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' + employeeID + '/' + pageNumber + '/' + columnName + '/' + sortType
    );
  }

  bulkChange(request: BulkChangeCustomerBillingExecutiveRequest) {
    request.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, request);
  }
}
