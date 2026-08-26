// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { UpsellDeclineReason } from './upsellDeclineReason.model';

@Injectable()
export class UpsellDeclineReasonService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'upsellDeclineReason';
  }

  getTableData(searchReasonName: string, searchActivationStatus: boolean, pageNumber: number): Observable<any> {
    return this.getTableDataSort(searchReasonName, searchActivationStatus, pageNumber, 'DisplayOrder', 'Ascending');
  }

  getTableDataSort(
    searchReasonName: string,
    searchActivationStatus: boolean,
    pageNumber: number,
    columnName: string,
    sortType: string
  ): Observable<any> {
    if (searchReasonName === '') {
      searchReasonName = 'null';
    }
    let activation = 'null';
    if (searchActivationStatus === true || searchActivationStatus === false) {
      activation = String(searchActivationStatus);
    }
    return this.httpClient.get(
      this.API_URL + '/' + searchReasonName + '/' + activation + '/' + pageNumber + '/' + columnName + '/' + sortType
    );
  }

  add(advanceTable: UpsellDeclineReason) {
    advanceTable.reasonID = -1;
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: UpsellDeclineReason) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(reasonID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + reasonID + '/' + userID);
  }
}
