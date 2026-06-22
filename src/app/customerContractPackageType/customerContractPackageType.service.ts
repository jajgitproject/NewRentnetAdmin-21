// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerContractPackageType } from './customerContractPackageType.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class CustomerContractPackageTypeService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerContractPackageType';
  }

  getTableData(customerContractID: number, searchCustomerContractPackageType: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (searchCustomerContractPackageType === '') {
      searchCustomerContractPackageType = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + customerContractID + '/' + searchCustomerContractPackageType + '/' + SearchActivationStatus + '/' + PageNumber + '/customerContractPackageTypeID/Ascending');
  }

  getTableDataSort(customerContractID: number, searchCustomerContractPackageType: string, SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchCustomerContractPackageType === '') {
      searchCustomerContractPackageType = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + customerContractID + '/' + searchCustomerContractPackageType + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  add(advanceTable: CustomerContractPackageType) {
    advanceTable.customerContractPackageTypeID = -1;
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: CustomerContractPackageType) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(customerContractPackageTypeID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + customerContractPackageTypeID + '/' + userID);
  }

  SaveCustomerContractPackageType(data: CustomerContractPackageType[]): Observable<any> {
    return this.httpClient.post(this.API_URL + '/Import', data);
  }

  GetPackageTypeToImportFromContractPackageType(customerContractID: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/GetPackageTypeToImportFromContractPackageType/' + customerContractID);
  }

  ImportFromCustomerContract(data: CustomerContractPackageType[]): Observable<any> {
    return this.httpClient.post(this.API_URL + '/ImportFromCustomerContract', data);
  }
}
