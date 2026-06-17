// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { BulkChangeCustomerCollectionExecutiveRequest } from './bulkChangeCustomerCollectionExecutive.model';

@Injectable()
export class BulkChangeCustomerCollectionExecutiveService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'bulkChangeCustomerCollectionExecutive';
  }

  getTableData(employeeID: number, pageNumber: number): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' + employeeID + '/' + pageNumber + '/CustomerCollectionExecutiveID/Ascending'
    );
  }

  getTableDataSort(employeeID: number, pageNumber: number, columnName: string, sortType: string): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' + employeeID + '/' + pageNumber + '/' + columnName + '/' + sortType
    );
  }

  bulkChange(request: BulkChangeCustomerCollectionExecutiveRequest) {
    request.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, request);
  }
}
