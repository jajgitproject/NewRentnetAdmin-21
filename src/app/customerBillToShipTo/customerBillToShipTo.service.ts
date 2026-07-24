// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { CustomerBillToShipTo } from './customerBillToShipTo.model';

@Injectable()
export class CustomerBillToShipToService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerBillToShipTo';
  }

  getTableData(
    searchID: number,
    customerID: number,
    activationStatus: boolean | null,
    pageNumber: number
  ): Observable<any> {
    const status =
      activationStatus === null || activationStatus === undefined ? 'null' : String(activationStatus);
    return this.httpClient.get(
      `${this.API_URL}/${searchID}/${customerID}/${status}/${pageNumber}/CustomerConfigurationBillToShipToID/Ascending`
    );
  }

  add(model: CustomerBillToShipTo): Observable<any> {
    model.customerConfigurationBillToShipToID = -1;
    model.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, model);
  }

  update(model: CustomerBillToShipTo): Observable<any> {
    model.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, model);
  }

  delete(id: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(`${this.API_URL}/${id}/${userID}`);
  }
}
