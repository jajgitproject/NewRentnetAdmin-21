// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerGroupDSEmails } from './customerGroupDSEmails.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class CustomerGroupDSEmailsService {
  private API_URL: string = '';
  isTblLoading = true;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerGroupDSEmails';
  }

  getTableData(customerGroupID: number, searchEmailID: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (customerGroupID === 0) {
      customerGroupID = 0;
    }
    if (searchEmailID === '') {
      searchEmailID = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + customerGroupID + '/' + searchEmailID + '/' + SearchActivationStatus + '/' + PageNumber + '/EmailID/Ascending');
  }

  getTableDataSort(customerGroupID: number, searchEmailID: string, SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (customerGroupID === 0) {
      customerGroupID = 0;
    }
    if (searchEmailID === '') {
      searchEmailID = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + customerGroupID + '/' + searchEmailID + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  add(advanceTable: CustomerGroupDSEmails) {
    advanceTable.customerGroupDSEmailsID = -1;
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: CustomerGroupDSEmails) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(customerGroupDSEmailsID: number): Observable<any> {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + customerGroupDSEmailsID + '/' + userID);
  }
}
