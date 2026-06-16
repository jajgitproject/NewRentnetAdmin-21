// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangeBillingExecutiveForCustomers } from './changeBillingExecutiveForCustomers.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class ChangeBillingExecutiveForCustomersService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerBillingExecutiveChange';
  }

  getTableData(SearchEmployeeName: string, SearchFromDate: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (SearchEmployeeName === '') {
      SearchEmployeeName = 'null';
    }
    if (SearchFromDate === '') {
      SearchFromDate = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }

    return this.httpClient.get(
      this.API_URL + '/' + SearchEmployeeName + '/' + SearchFromDate + '/' + SearchActivationStatus + '/' + PageNumber + '/BillingExecutiveUpdateID/Ascending'
    );
  }

  getTableDataSort(
    SearchEmployeeName: string,
    SearchNewBillingExecutiveActivationFromDate: string,
    SearchNewBillingExecutiveActivationStatus: boolean,
    PageNumber: number,
    coloumName: string,
    sortType: string
  ): Observable<any> {
    if (SearchEmployeeName === '') {
      SearchEmployeeName = 'null';
    }
    if (SearchNewBillingExecutiveActivationFromDate === '') {
      SearchNewBillingExecutiveActivationFromDate = 'null';
    }
    if (SearchNewBillingExecutiveActivationStatus === null) {
      SearchNewBillingExecutiveActivationStatus = null;
    }

    return this.httpClient.get(
      this.API_URL + '/' + SearchEmployeeName + '/' + SearchNewBillingExecutiveActivationFromDate + '/' + SearchNewBillingExecutiveActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType
    );
  }

  add(advanceTable: ChangeBillingExecutiveForCustomers) {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.customerBillingExecutiveID = -1;
    advanceTable.newBillingExecutiveActivationFromDateString = this.generalService.getTimeApplicable(advanceTable.newBillingExecutiveActivationFromDate);
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: ChangeBillingExecutiveForCustomers) {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.newBillingExecutiveActivationFromDateString = this.generalService.getTimeApplicable(advanceTable.newBillingExecutiveActivationFromDate);
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(changeBillingExecutiveForCustomersId: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + changeBillingExecutiveForCustomersId + '/' + userID);
  }
}
