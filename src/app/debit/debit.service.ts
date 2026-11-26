// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { DebitModel } from './debit.model';

@Injectable()
export class DebitService {
  private API_URL = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'debit';
  }

  getTableData(
    searchField: string,
    searchValue: string,
    activationStatus: boolean | null,
    pageNumber: number,
    orderByColumn: string,
    order: string
  ): Observable<any> {
    if (!searchField) {
      searchField = 'search';
    }
    if (!searchValue) {
      searchValue = 'null';
    }
    let active = '1';
    if (activationStatus === false) {
      active = '0';
    } else if (activationStatus === null) {
      active = 'all';
    }
    return this.httpClient.get(
      `${this.API_URL}/${encodeURIComponent(searchField)}/${encodeURIComponent(searchValue)}/${active}/${pageNumber}/${orderByColumn}/${order}`
    );
  }

  advancedSearch(criteria: any): Observable<any> {
    const payload = { ...(criteria || {}) };
    if (payload.pageNumber == null) {
      payload.pageNumber = 0;
    }
    if (!payload.orderByColumn) {
      payload.orderByColumn = 'DebitID';
    }
    if (!payload.order) {
      payload.order = 'Descending';
    }
    payload.useAdvancedSearch = true;
    return this.httpClient.post<any>(`${this.API_URL}/search`, payload);
  }

  setActivationStatus(debitId: number, activationStatus: boolean): Observable<any> {
    return this.httpClient.put<any>(`${this.API_URL}/activationStatus`, {
      debitID: debitId,
      activationStatus,
      userID: this.generalService.getUserID()
    });
  }

  getById(debitId: number): Observable<DebitModel> {
    return this.httpClient.get<DebitModel>(`${this.API_URL}/${debitId}`);
  }

  getDebitTypesForScreen(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/debitTypesForScreen`);
  }

  getDebitTypesForIncidenceScreen(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/debitTypesForIncidenceScreen`);
  }

  getAllDebitTypesForMIS(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/debitTypesForMIS`);
  }

  getByIncidenceId(incidenceId: number): Observable<DebitModel> {
    return this.httpClient.get<DebitModel>(`${this.API_URL}/byIncidence/${incidenceId}`);
  }

  saveFromIncidenceResolution(data: any) {
    return this.httpClient.post<any>(`${this.API_URL}/fromIncidenceResolution`, this.toApiPayload(data));
  }

  deleteFromIncidenceResolution(debitId: number, incidenceId: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(
      `${this.API_URL}/fromIncidenceResolution/${debitId}/${incidenceId}/${userID}`
    );
  }

  searchDrivers(prefix: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/drivers/${encodeURIComponent(prefix)}`);
  }

  searchSuppliers(prefix: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/suppliers/${encodeURIComponent(prefix)}`);
  }

  searchInventories(prefix: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/inventories/${encodeURIComponent(prefix)}`);
  }

  getDriverInventory(driverId: number, dateString: string): Observable<any> {
    const d = dateString || 'null';
    return this.httpClient.get(`${this.API_URL}/driverInventory/${driverId}/${encodeURIComponent(d)}`);
  }

  add(data: any) {
    return this.httpClient.post<any>(this.API_URL, this.toApiPayload(data));
  }

  update(data: any) {
    return this.httpClient.put<any>(this.API_URL, this.toApiPayload(data));
  }

  delete(debitId: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(`${this.API_URL}/${debitId}/${userID}`);
  }

  getLogs(debitId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.API_URL}/logs/${debitId}`);
  }

  private toApiPayload(data: any) {
    let dateString = (data.dateString || '').trim();
    if (data.date) {
      try {
        const d = data.date instanceof Date ? data.date : new Date(data.date);
        if (!isNaN(d.getTime())) {
          dateString = formatDate(d, 'yyyy-MM-dd', 'en-GB');
        }
      } catch (e) {
        /* keep dateString */
      }
    }

  const nullableInt = (v: any) => {
      const n = Number(v);
      return isNaN(n) || n <= 0 ? null : n;
    };

    return {
      debitID: Number(data.debitID) > 0 ? Number(data.debitID) : -1,
      dutySlipID: nullableInt(data.dutySlipID),
      reservationID: nullableInt(data.reservationID),
      incidenceID: nullableInt(data.incidenceID),
      driverID: nullableInt(data.driverID),
      supplierID: nullableInt(data.supplierID),
      inventoryID: nullableInt(data.inventoryID),
      dateString: dateString || null,
      locationID: Number(data.locationID) || 0,
      debitTypeID: Number(data.debitTypeID) || 0,
      amount: Number(data.amount) || 0,
      narration: (data.narration || '').trim(),
      userID: this.generalService.getUserID(),
      activationStatus: data.activationStatus === false ? false : true
    };
  }
}