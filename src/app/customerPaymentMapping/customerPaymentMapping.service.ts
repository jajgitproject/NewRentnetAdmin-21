// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
import { CustomerPaymentMapping, CustomerPaymentMappingCustomerDropDown } from './customerPaymentMapping.model';

@Injectable()
export class CustomerPaymentMappingService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerPaymentMapping';
  }

  getTableData(customerID: number, modeOfPayment: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (customerID === 0) {
      customerID = 0;
    }
    if (modeOfPayment === '') {
      modeOfPayment = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(
      this.API_URL + '/' + customerID + '/' + modeOfPayment + '/' + SearchActivationStatus + '/' + PageNumber + '/CustomerPaymentMappingID/Ascending'
    );
  }

  getTableDataSort(
    customerID: number,
    modeOfPayment: string,
    SearchActivationStatus: Boolean,
    PageNumber: number,
    coloumName: string,
    sortType: string
  ): Observable<any> {
    if (customerID === 0) {
      customerID = 0;
    }
    if (modeOfPayment === '') {
      modeOfPayment = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(
      this.API_URL + '/' + customerID + '/' + modeOfPayment + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType
    );
  }

  getCustomersForContract(customerContractID: number): Observable<CustomerPaymentMappingCustomerDropDown[]> {
    return this.httpClient.get<CustomerPaymentMappingCustomerDropDown[]>(
      this.API_URL + '/CustomersForContract/' + customerContractID
    );
  }

  add(advanceTable: CustomerPaymentMapping) {
    advanceTable.customerPaymentMappingID = -1;
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: CustomerPaymentMapping) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(customerPaymentMappingID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + customerPaymentMappingID + '/' + userID);
  }
}
