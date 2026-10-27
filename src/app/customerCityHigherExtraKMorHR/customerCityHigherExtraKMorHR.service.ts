// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerCityHigherExtraKMorHR } from './customerCityHigherExtraKMorHR.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class CustomerCityHigherExtraKMorHRService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerCityHigherExtraKMorHR';
  }

  getTableData(
    customerID: number,
    searchCityName: string,
    searchChargeHigher: string,
    searchActivationStatus: boolean,
    pageNumber: number
  ): Observable<any> {
    if (searchCityName === '') {
      searchCityName = 'null';
    }
    if (searchChargeHigher === '' || searchChargeHigher === null || searchChargeHigher === undefined) {
      searchChargeHigher = 'null';
    }
    return this.httpClient.get(
      this.API_URL +
        '/' +
        customerID +
        '/' +
        searchCityName +
        '/' +
        searchChargeHigher +
        '/' +
        searchActivationStatus +
        '/' +
        pageNumber +
        '/CustomerCityHigherExtraKMorHRID/Ascending'
    );
  }

  getTableDataSort(
    customerID: number,
    searchCityName: string,
    searchChargeHigher: string,
    searchActivationStatus: boolean,
    pageNumber: number,
    columnName: string,
    sortType: string
  ): Observable<any> {
    if (searchCityName === '') {
      searchCityName = 'null';
    }
    if (searchChargeHigher === '' || searchChargeHigher === null || searchChargeHigher === undefined) {
      searchChargeHigher = 'null';
    }
    return this.httpClient.get(
      this.API_URL +
        '/' +
        customerID +
        '/' +
        searchCityName +
        '/' +
        searchChargeHigher +
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

  add(record: CustomerCityHigherExtraKMorHR) {
    record.customerCityHigherExtraKMorHRID = -1;
    record.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, record);
  }

  update(record: CustomerCityHigherExtraKMorHR) {
    record.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, record);
  }

  delete(customerCityHigherExtraKMorHRID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + customerCityHigherExtraKMorHRID + '/' + userID);
  }
}
