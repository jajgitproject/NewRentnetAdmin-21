// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { BulkChangeCustomerKAMRequest } from './bulkChangeCustomerKAM.model';

@Injectable()
export class BulkChangeCustomerKAMService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'bulkChangeCustomerKAM';
  }

  getTableData(employeeID: number, pageNumber: number): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' + employeeID + '/' + pageNumber + '/CustomerKeyAccountManagerID/Ascending'
    );
  }

  getTableDataSort(employeeID: number, pageNumber: number, columnName: string, sortType: string): Observable<any> {
    return this.httpClient.get(
      this.API_URL + '/' + employeeID + '/' + pageNumber + '/' + columnName + '/' + sortType
    );
  }

  bulkChange(request: BulkChangeCustomerKAMRequest) {
    request.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, request);
  }
}
