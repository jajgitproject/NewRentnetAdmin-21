// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { ChangeModeOfPaymentModel } from './changeModeOfPayment.model';

@Injectable()
export class ChangeModeOfPaymentService {
  private API_URL: string = '';
  private API_URL_Customer: string = '';
  isTblLoading = true;
  Result: string = 'Failure';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'changeModeOfPayment';
    this.API_URL_Customer = generalService.BaseURL + 'customer';
  }

  private toRouteParam(value: any): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return encodeURIComponent(String(value));
  }

  getTableData(
    SearchCustomerGroup: any,
    SearchCustomerName: any,
    SearchCity: any,
    SearchVehicle: any,
    SearchPackageType: any,
    SearchPackage: any,
    SearchFromDate: any,
    SearchToDate: any,
    SearchReservationID: any,
    SearchDutySlipID: any,
    SearchActivationStatus: any,
    PageNumber: number,
    SearchModeOfPayment: any = null
  ): Observable<any> {
    let url = `${this.API_URL}/${this.toRouteParam(SearchCustomerGroup)}/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchCity)}/${this.toRouteParam(SearchVehicle)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPackage)}/${this.toRouteParam(SearchFromDate)}/${this.toRouteParam(SearchToDate)}/${this.toRouteParam(SearchReservationID)}/${this.toRouteParam(SearchDutySlipID)}/${SearchActivationStatus}/${PageNumber}/ReservationID/Descending`;
    if (SearchModeOfPayment) {
      url += `?ModeOfPayment=${this.toRouteParam(SearchModeOfPayment)}`;
    }
    return this.httpClient.get(url);
  }

  getTableDataSort(
    SearchCustomerGroup: any,
    SearchCustomerName: any,
    SearchCity: any,
    SearchVehicle: any,
    SearchPackageType: any,
    SearchPackage: any,
    SearchFromDate: any,
    SearchToDate: any,
    SearchReservationID: any,
    SearchDutySlipID: any,
    SearchActivationStatus: any,
    PageNumber: number,
    coloumName: string,
    sortType: string,
    SearchModeOfPayment: any = null
  ): Observable<any> {
    let url = `${this.API_URL}/${this.toRouteParam(SearchCustomerGroup)}/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchCity)}/${this.toRouteParam(SearchVehicle)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPackage)}/${this.toRouteParam(SearchFromDate)}/${this.toRouteParam(SearchToDate)}/${this.toRouteParam(SearchReservationID)}/${this.toRouteParam(SearchDutySlipID)}/${SearchActivationStatus}/${PageNumber}/${coloumName}/${sortType}`;
    if (SearchModeOfPayment) {
      url += `?ModeOfPayment=${this.toRouteParam(SearchModeOfPayment)}`;
    }
    return this.httpClient.get(url);
  }

  add(advanceTable: ChangeModeOfPaymentModel): Observable<any> {
    advanceTable.userID = this.generalService.getUserID();
    advanceTable.changeEmployeeID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + '/AddChangeModeOfPayment', advanceTable);
  }

  getChangeModeOfPaymentData(ReservationID: number): Observable<any[]> {
    const url =
      this.generalService.getBaseURL() +
      'changeModeOfPayment/GetAllChangeModeOfPayment/' +
      ReservationID +
      '?t=' +
      Date.now();
    return this.httpClient.get<any[]>(url);
  }
}
