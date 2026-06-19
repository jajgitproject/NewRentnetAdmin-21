// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IncidenceEmailToBeSentTo } from './incidenceEmailToBeSentTo.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class IncidenceEmailToBeSentToService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'incidenceEmailToBeSentTo';
  }

  getTableData(SearchIncidenceEmailToBeSentTo: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (SearchIncidenceEmailToBeSentTo === '') {
      SearchIncidenceEmailToBeSentTo = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(
      this.API_URL + '/' + SearchIncidenceEmailToBeSentTo + '/' + SearchActivationStatus + '/' + PageNumber + '/IncidenceEmailToBeSentTo/Ascending'
    );
  }

  getTableDataSort(
    SearchIncidenceEmailToBeSentTo: string,
    SearchActivationStatus: boolean,
    PageNumber: number,
    coloumName: string,
    sortType: string
  ): Observable<any> {
    if (SearchIncidenceEmailToBeSentTo === '') {
      SearchIncidenceEmailToBeSentTo = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(
      this.API_URL + '/' + SearchIncidenceEmailToBeSentTo + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType
    );
  }

  add(advanceTable: IncidenceEmailToBeSentTo) {
    advanceTable.incidenceEmailToBeSentToID = -1;
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: IncidenceEmailToBeSentTo) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(incidenceEmailToBeSentToID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + incidenceEmailToBeSentToID + '/' + userID);
  }
}
