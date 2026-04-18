// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DriverComplianceDashboard } from './driverComplianceDashboard.model';
import { OrganizationalEntity } from '../organizationalEntity/organizationalEntity.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
@Injectable()
export class DriverComplianceDashboardService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "driverComplianceDashboard";
  }

  /** CRUD METHODS */
  getTableData(searchDocumentName:string,searchDocumentType: string,
    searchOwnedSupplier: string,
    searchLocation: string,
    searchDaysRemaning: string,
    searchActivationStatus: boolean,
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
    return this.httpClient.get(this.API_URL + '/'+ searchDocumentName + '/' + searchDocumentType + '/' + searchOwnedSupplier + '/' + searchLocation + '/' + searchDaysRemaning + '/' + searchActivationStatus + '/' + PageNumber + '/DriverID/Ascending');

  }

  getTableDataSort(
    searchDocumentName:string,
    searchDocumentType: string,
    searchOwnedSupplier: string,
    searchLocation: string,
    searchDaysRemaning: string,
    searchActivationStatus: boolean,
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

 GetDocumentType(): Observable<DriverComplianceDashboard[]> 
  {
    return this.httpClient.get<DriverComplianceDashboard[]>(this.API_URL + "/GetDocumentType");
  }
   GetLocation(): Observable<OrganizationalEntityDropDown[]> 
  {
    return this.httpClient.get<OrganizationalEntityDropDown[]>(this.generalService.BaseURL + "organizationalEntity/ForLocationDropDown");
  }
 

}
