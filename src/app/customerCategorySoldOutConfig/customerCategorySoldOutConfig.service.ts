// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import {
  CustomerCategorySoldOutConfigModel,
  CustomerCategorySoldOutCheckResult
} from './customerCategorySoldOutConfig.model';

@Injectable()
export class CustomerCategorySoldOutConfigService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerCategorySoldOutConfig';
  }

  getTableData(
    customerCategoryID: any,
    cityID: any,
    packageTypeID: any,
    vehicleID: any,
    activationStatus: any,
    pageNumber: number
  ): Observable<any> {
    return this.httpClient.get(
      this.API_URL +
        '/' +
        (customerCategoryID || 'null') +
        '/' +
        (cityID || 'null') +
        '/' +
        (packageTypeID || 'null') +
        '/' +
        (vehicleID || 'null') +
        '/' +
        (activationStatus === null || activationStatus === undefined ? 'null' : activationStatus) +
        '/' +
        pageNumber +
        '/CustomerCategorySoldOutConfigID/Ascending'
    );
  }

  add(model: CustomerCategorySoldOutConfigModel) {
    model.customerCategorySoldOutConfigID = -1;
    model.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, model);
  }

  update(model: CustomerCategorySoldOutConfigModel) {
    model.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, model);
  }

  delete(id: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + id + '/' + userID);
  }

  checkSoldOut(
    customerID: number,
    cityID: number,
    packageTypeID: number,
    vehicleID: number,
    pickupDateTime: string
  ): Observable<CustomerCategorySoldOutCheckResult> {
    const encoded = encodeURIComponent(pickupDateTime || 'null');
    return this.httpClient.get<CustomerCategorySoldOutCheckResult>(
      this.API_URL +
        '/Check/' +
        customerID +
        '/' +
        cityID +
        '/' +
        packageTypeID +
        '/' +
        vehicleID +
        '/' +
        encoded
    );
  }
}
