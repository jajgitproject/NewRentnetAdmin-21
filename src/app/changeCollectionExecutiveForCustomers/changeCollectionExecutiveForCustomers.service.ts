// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangeCollectionExecutiveForCustomers } from './changeCollectionExecutiveForCustomers.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class ChangeCollectionExecutiveForCustomersService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerCollectionExecutiveChange';
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
      this.API_URL + '/' + SearchEmployeeName + '/' + SearchFromDate + '/' + SearchActivationStatus + '/' + PageNumber + '/CollectionExecutiveUpdateID/Ascending'
    );
  }

  getTableDataSort(
    SearchEmployeeName: string,
    SearchNewCollectionExecutiveActivationFromDate: string,
    SearchNewCollectionExecutiveActivationStatus: boolean,
    PageNumber: number,
    coloumName: string,
    sortType: string
  ): Observable<any> {
    if (SearchEmployeeName === '') {
      SearchEmployeeName = 'null';
    }
    if (SearchNewCollectionExecutiveActivationFromDate === '') {
      SearchNewCollectionExecutiveActivationFromDate = 'null';
    }
    if (SearchNewCollectionExecutiveActivationStatus === null) {
      SearchNewCollectionExecutiveActivationStatus = null;
    }

    return this.httpClient.get(
      this.API_URL + '/' + SearchEmployeeName + '/' + SearchNewCollectionExecutiveActivationFromDate + '/' + SearchNewCollectionExecutiveActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType
    );
  }

  add(advanceTable: ChangeCollectionExecutiveForCustomers) {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.customerCollectionExecutiveID = -1;
    advanceTable.newCollectionExecutiveActivationFromDateString = this.generalService.getTimeApplicable(advanceTable.newCollectionExecutiveActivationFromDate);
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: ChangeCollectionExecutiveForCustomers) {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.newCollectionExecutiveActivationFromDateString = this.generalService.getTimeApplicable(advanceTable.newCollectionExecutiveActivationFromDate);
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(changeCollectionExecutiveForCustomersId: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + changeCollectionExecutiveForCustomersId + '/' + userID);
  }
}
