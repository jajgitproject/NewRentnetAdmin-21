// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { InventoryComplianceDashboardModel } from './inventoryComplianceDashboard.model';
import { OrganizationalEntity } from '../organizationalEntity/organizationalEntity.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
@Injectable()
export class InventoryComplianceDashboardService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "inventoryComplianceDashboard";
  }

  /** CRUD METHODS */
  getTableData(searchDocumentType: string, SearchDocumentName:string ,searchOwnedSupplier: string,searchLocation: string,searchDaysRemaning: string,searchActivationStatus: string,PageNumber: number): Observable<any> 
  {
    if (searchDocumentType === "")
    {
      searchDocumentType = null;
    }
    if (SearchDocumentName === "")
    {
      SearchDocumentName = null;
    }
    if (searchOwnedSupplier === "") 
    {
      searchOwnedSupplier = null;
    }
    if (searchLocation === "") 
    {
      searchLocation = null;
    }
    if (searchDaysRemaning === "") 
    {
      searchDaysRemaning = null;
    }    
    if (searchActivationStatus === null) 
    {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + searchDocumentType + '/' + SearchDocumentName + '/' + searchOwnedSupplier + '/' + searchLocation + '/' + searchDaysRemaning + '/' + searchActivationStatus + '/' + PageNumber + '/InventoryID/Ascending');

  }

  getTableDataSort(searchDocumentType: string, SearchDocumentName:string,searchOwnedSupplier: string,searchLocation: string,searchDaysRemaning: string,searchActivationStatus: string,PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if (searchDocumentType === "") 
    {
      searchDocumentType = null;
    }
    if (SearchDocumentName === "") 
    {
      SearchDocumentName = null;
    }
    if (searchOwnedSupplier === "") 
    {
      searchOwnedSupplier = null;
    }
    if (searchLocation === "") 
    {
      searchLocation = null;
    }
    if (searchDaysRemaning === "") 
    {
      searchDaysRemaning = null;
    }    
    if (searchActivationStatus === null) 
    {
      searchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchDocumentType + '/' + SearchDocumentName + '/' + searchOwnedSupplier + '/' + searchLocation + '/' + searchDaysRemaning +  '/' + searchActivationStatus + '/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  GetDocumentType(): Observable<InventoryComplianceDashboardModel[]> 
  {
    return this.httpClient.get<InventoryComplianceDashboardModel[]>(this.API_URL + "/GetDocumentTypeForInventory");
  }

   GetLocation(): Observable<OrganizationalEntityDropDown[]> 
  {
    return this.httpClient.get<OrganizationalEntityDropDown[]>(this.generalService.BaseURL + "organizationalEntity/ForLocationDropDown");
  }

  GetDocumentName(): Observable<InventoryComplianceDashboardModel[]> 
  {
    return this.httpClient.get<InventoryComplianceDashboardModel[]>(this.API_URL + "/GetDocumentNameForInventory");
  }

}
