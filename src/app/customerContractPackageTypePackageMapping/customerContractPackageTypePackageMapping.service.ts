// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerContractPackageTypePackageMapping } from './customerContractPackageTypePackageMapping.model';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';

@Injectable()
export class CustomerContractPackageTypePackageMappingService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'customerContractPackageTypePackageMapping';
  }

  getTableData(customerContractID: number, customerContractPackageTypeID: number, searchCustomerContractPackageTypePackageMappingID: number, searchPackage: string, searchcustomerPackageName: string, searchcustomerPackageCodeForIntegration: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (searchPackage === '') {
      searchPackage = 'null';
    }
    if (searchcustomerPackageName === '') {
      searchcustomerPackageName = 'null';
    }
    if (searchcustomerPackageCodeForIntegration === '') {
      searchcustomerPackageCodeForIntegration = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + customerContractID + '/' + customerContractPackageTypeID + '/' + searchCustomerContractPackageTypePackageMappingID + '/' + searchPackage + '/' + searchcustomerPackageName + '/' + searchcustomerPackageCodeForIntegration + '/' + SearchActivationStatus + '/' + PageNumber + '/customerContractPackageTypePackageMappingID/Ascending');
  }

  getTableDataSort(customerContractID: number, customerContractPackageTypeID: number, searchCustomerContractPackageTypePackageMappingID: number, searchPackage: string, searchcustomerPackageName: string, searchcustomerPackageCodeForIntegration: string, SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchPackage === '') {
      searchPackage = 'null';
    }
    if (searchcustomerPackageName === '') {
      searchcustomerPackageName = 'null';
    }
    if (searchcustomerPackageCodeForIntegration === '') {
      searchcustomerPackageCodeForIntegration = 'null';
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + customerContractID + '/' + customerContractPackageTypeID + '/' + searchCustomerContractPackageTypePackageMappingID + '/' + searchPackage + '/' + searchcustomerPackageName + '/' + searchcustomerPackageCodeForIntegration + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }

  add(advanceTable: CustomerContractPackageTypePackageMapping) {
    advanceTable.customerContractPackageTypePackageMappingID = -1;
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }

  update(advanceTable: CustomerContractPackageTypePackageMapping) {
    advanceTable.userID = this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }

  delete(customerContractPackageTypePackageMappingID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + customerContractPackageTypePackageMappingID + '/' + userID);
  }
}
