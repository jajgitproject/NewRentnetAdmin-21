// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { OrganizationalEntity } from '../organizationalEntity/organizationalEntity.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
import { DriverComplianceDashboard } from '../driverComplianceDashboard/driverComplianceDashboard.model';
@Injectable()
export class SupplierComplianceDashboardService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "supplierComplianceDashboard";
  }

  /** CRUD METHODS */
  getTableData(    
    searchDocumentName:string,
    searchDocumentType: string,
    searchOwnedSupplier: string,
    searchLocation: string,
    searchDaysRemaning: string,
    searchActivationStatus: string,
    PageNumber: number): Observable<any> {
    if (searchDocumentName === "") {
      searchDocumentName = null;
    }
    if (searchDocumentType === "") {
      searchDocumentType = null;
    }
    if (searchOwnedSupplier === "") {
      searchOwnedSupplier = null;
    }
    if (searchLocation === "") {
      searchLocation = null;
    }

    if (searchDaysRemaning === "") {
      searchDaysRemaning = null;
    }
    
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + searchDocumentName + '/' + searchDocumentType + '/' + searchOwnedSupplier + '/' + searchLocation + '/' + searchDaysRemaning + '/' + searchActivationStatus + '/' + PageNumber + '/SupplierID/Ascending');

  }

  getTableDataSort(
    searchDocumentName:string,
    searchDocumentType: string,
    searchOwnedSupplier: string,
    searchLocation: string,
    searchDaysRemaning: string,
    searchActivationStatus: string,
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if (searchDocumentName === "") {
      searchDocumentName = null;
    }
     if (searchDocumentType === "") {
      searchDocumentType = null;
    }
    if (searchOwnedSupplier === "") {
      searchOwnedSupplier = null;
    }
    if (searchLocation === "") {
      searchLocation = null;
    }

    if (searchDaysRemaning === "") {
      searchDaysRemaning = null;
    }
    
    if (searchActivationStatus === null) {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchDocumentName + '/' + searchDocumentType + '/' + searchOwnedSupplier + '/' + searchLocation + '/' + searchDaysRemaning +  '/' + searchActivationStatus + '/' + PageNumber + '/'+coloumName+'/'+sortType);
  }


   GetLocation(): Observable<OrganizationalEntityDropDown[]> 
  {
    return this.httpClient.get<OrganizationalEntityDropDown[]>(this.generalService.BaseURL + "organizationalEntity/ForCompanyDropDown");
  }

}
