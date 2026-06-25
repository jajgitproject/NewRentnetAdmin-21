// @ts-nocheck
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeneralService } from '../general/general.service';
import { IncidenceMISSearchCriteria } from './incidenceMIS.model';

@Injectable()
export class IncidenceMISService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'incidenceMIS';
  }

  getTableData(criteria: IncidenceMISSearchCriteria, pageNumber: number): Observable<any> {
    const payload = {
      searchCustomerGroup: criteria.searchCustomerGroup || null,
      searchCustomer: criteria.searchCustomer || null,
      searchSalesPerson: criteria.searchSalesPerson || null,
      searchPassengerName: criteria.searchPassengerName || null,
      searchVehicleCategoryID: criteria.searchVehicleCategoryID || 0,
      searchVehicleID: criteria.searchVehicleID || 0,
      searchRegistrationNumber: criteria.searchRegistrationNumber || null,
      searchDriver: criteria.searchDriver || null,
      searchDispatchLocationID: criteria.searchDispatchLocationID || 0,
      searchIncidenceFromDate: criteria.searchIncidenceFromDate || null,
      searchIncidenceToDate: criteria.searchIncidenceToDate || null,
      searchIncidenceTypeID: criteria.searchIncidenceTypeID || 0,
      pageNumber,
      orderByColumn: criteria.orderByColumn || 'IncidenceID',
      order: criteria.order || 'Descending'
    };
    return this.httpClient.post(this.API_URL, payload);
  }

  exportCsv(criteria: IncidenceMISSearchCriteria): Observable<Blob> {
    const payload = {
      searchCustomerGroup: criteria.searchCustomerGroup || null,
      searchCustomer: criteria.searchCustomer || null,
      searchSalesPerson: criteria.searchSalesPerson || null,
      searchPassengerName: criteria.searchPassengerName || null,
      searchVehicleCategoryID: criteria.searchVehicleCategoryID || 0,
      searchVehicleID: criteria.searchVehicleID || 0,
      searchRegistrationNumber: criteria.searchRegistrationNumber || null,
      searchDriver: criteria.searchDriver || null,
      searchDispatchLocationID: criteria.searchDispatchLocationID || 0,
      searchIncidenceFromDate: criteria.searchIncidenceFromDate || null,
      searchIncidenceToDate: criteria.searchIncidenceToDate || null,
      searchIncidenceTypeID: criteria.searchIncidenceTypeID || 0,
      pageNumber: 0,
      orderByColumn: criteria.orderByColumn || 'IncidenceID',
      order: criteria.order || 'Descending'
    };
    return this.httpClient.post(`${this.API_URL}/ExportCsv`, payload, { responseType: 'blob' });
  }

  getCustomerSalesManagerDropDown(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + 'customerSalesManager/ForDropDown');
  }

  getDriverByPrefix(prefix: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.generalService.BaseURL + `driver/GetAllDriverList/${encodeURIComponent(prefix)}`);
  }
}
