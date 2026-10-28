// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MaxGarageInOutKMMinutes } from './maxGarageInOutKMMinutes.model';
import { GeneralService } from '../general/general.service';

@Injectable()
export class MaxGarageInOutKMMinutesService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'maxGarageInOutKMMinutes';
  }

  getTableData(
    customerContractID: number,
    searchPackageType: string,
    searchActivationStatus: boolean | null,
    pageNumber: number
  ): Observable<any> {
    return this.getTableDataSort(
      customerContractID,
      searchPackageType,
      searchActivationStatus,
      pageNumber,
      'm.CustomerContractMaxG2GKMMinutesID',
      'Descending'
    );
  }

  getTableDataSort(
    customerContractID: number,
    searchPackageType: string,
    searchActivationStatus: boolean | null,
    pageNumber: number,
    columnName: string,
    sortType: string
  ): Observable<any> {
    let packageType = searchPackageType === '' ? 'null' : searchPackageType;
    let activationStatus =
      searchActivationStatus === null || searchActivationStatus === undefined
        ? 'null'
        : searchActivationStatus;
    return this.httpClient.get(
      `${this.API_URL}/${customerContractID}/${packageType}/${activationStatus}/${pageNumber}/${columnName}/${sortType}`
    );
  }

  getActiveByPackageTypeID(
    customerContractID: number,
    packageTypeID: number
  ): Observable<MaxGarageInOutKMMinutes | null> {
    return this.httpClient
      .get<MaxGarageInOutKMMinutes>(`${this.API_URL}/active/${customerContractID}/${packageTypeID}`)
      .pipe(
        map((record) =>
          record && record.customerContractMaxG2GKMMinutesID > 0 ? record : null
        ),
        catchError(() => of(null))
      );
  }

  add(record: MaxGarageInOutKMMinutes): Observable<any> {
    const employeeId = this.generalService.getUserID();
    record.customerContractMaxG2GKMMinutesID = -1;
    record.userID = employeeId;
    record.createdByID = employeeId;
    record.activationStatus = true;
    return this.httpClient.post<any>(this.API_URL, record);
  }

  delete(customerContractMaxG2GKMMinutesID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(
      `${this.API_URL}/${customerContractMaxG2GKMMinutesID}/${userID}`
    );
  }
}
