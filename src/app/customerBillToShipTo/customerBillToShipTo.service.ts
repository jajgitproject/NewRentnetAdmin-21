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
    const body = this.toApiBody(model, true);
    return this.httpClient.post<any>(this.API_URL, body);
  }

  update(model: CustomerBillToShipTo): Observable<any> {
    const body = this.toApiBody(model, false);
    return this.httpClient.put<any>(this.API_URL, body);
  }

  delete(id: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(`${this.API_URL}/${id}/${userID}`);
  }

  private toApiBody(model: CustomerBillToShipTo, isCreate: boolean): any {
    return {
      customerConfigurationBillToShipToID: isCreate
        ? -1
        : Number(model.customerConfigurationBillToShipToID),
      customerID: Number(model.customerID),
      userID: Number(this.generalService.getUserID()),
      address1: model.address1 || '',
      address2: model.address2 || '',
      stateID: Number(model.stateID),
      cityID: Number(model.cityID),
      pincode: model.pincode || '',
      gstno: model.gstno || model.gSTNO || '',
      gSTNO: model.gstno || model.gSTNO || '',
      startDate: this.formatDateForApi(model.startDate),
      endDate: this.formatDateForApi(model.endDate),
      activationStatus: model.activationStatus === true,
    };
  }

  /** Send date-only yyyy-MM-dd so SQL date column never gets null/invalid from locale formats. */
  private formatDateForApi(value: any): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Already ISO / yyyy-MM-dd
      if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.substring(0, 10);
      }
      // DD/MM/YYYY (en-GB typed input)
      const dmy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (dmy) {
        const day = dmy[1].padStart(2, '0');
        const month = dmy[2].padStart(2, '0');
        return `${dmy[3]}-${month}-${day}`;
      }
    }

    const date =
      value instanceof Date
        ? value
        : value?.toDate
          ? value.toDate()
          : new Date(value);

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}
