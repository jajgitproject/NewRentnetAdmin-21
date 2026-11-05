// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { BookingRefusal } from './bookingRefusal.model';

@Injectable()
export class BookingRefusalService {
  private API_URL: string = '';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + 'bookingRefusal';
  }

  getTableData(searchField: string, searchValue: string, pageNumber: number): Observable<any> {
    return this.getTableDataSort(searchField, searchValue, pageNumber, 'ReservationRefusalID', 'Descending');
  }

  getTableDataSort(
    searchField: string,
    searchValue: string,
    pageNumber: number,
    columnName: string,
    sortType: string
  ): Observable<any> {
    if (!searchField || searchField === '') {
      searchField = 'search';
    }
    if (searchValue === '') {
      searchValue = 'null';
    }
    const field = encodeURIComponent(searchField);
    const value = encodeURIComponent(searchValue ?? 'null');
    return this.httpClient.get(
      this.API_URL + '/' + field + '/' + value + '/' + pageNumber + '/' + columnName + '/' + sortType
    );
  }

  add(advanceTable: BookingRefusal | any) {
    const payload = this.toApiPayload(advanceTable);
    return this.httpClient.post<any>(this.API_URL, payload, { responseType: 'json' });
  }

  update(advanceTable: BookingRefusal | any) {
    const payload = this.toApiPayload(advanceTable);
    return this.httpClient.put<any>(this.API_URL, payload, { responseType: 'json' });
  }

  delete(reservationRefusalID: number): Observable<any> {
    const userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + reservationRefusalID + '/' + userID);
  }

  search(criteria: any): Observable<any> {
    const payload = { ...(criteria || {}) };
    if (payload.pageNumber == null) {
      payload.pageNumber = 0;
    }
    if (!payload.orderByColumn) {
      payload.orderByColumn = 'ReservationRefusalID';
    }
    if (!payload.order) {
      payload.order = 'Descending';
    }
    return this.httpClient.post<any>(this.API_URL + '/search', payload, { responseType: 'json' });
  }

  exportSearch(criteria: any): Observable<any> {
    const payload = { ...(criteria || {}) };
    if (!payload.orderByColumn) {
      payload.orderByColumn = 'ReservationRefusalID';
    }
    if (!payload.order) {
      payload.order = 'Descending';
    }
    return this.httpClient.post<any>(this.API_URL + '/search/export', payload, { responseType: 'json' });
  }

  private toApiPayload(data: any) {
    let pickUpDateString = (data.pickUpDateString || '').trim();
    if (data.pickUpDate) {
      try {
        const d = data.pickUpDate instanceof Date ? data.pickUpDate : new Date(data.pickUpDate);
        if (!isNaN(d.getTime())) {
          pickUpDateString = formatDate(d, 'yyyy-MM-dd', 'en-GB');
        }
      } catch (e) {
        /* keep existing pickUpDateString */
      }
    }
    let pickUpTimeString = (data.pickUpTimeString || '').trim();
    if (data.pickUpTime) {
      try {
        const t = data.pickUpTime instanceof Date ? data.pickUpTime : new Date(data.pickUpTime);
        if (!isNaN(t.getTime())) {
          pickUpTimeString = formatDate(t, 'HH:mm:ss', 'en-GB');
        }
      } catch (e) {
        /* keep pickUpTimeString */
      }
    }
    if (pickUpTimeString.length === 5 && pickUpTimeString.indexOf(':') === 2) {
      pickUpTimeString = pickUpTimeString + ':00';
    }
    const customerID = Number(data.customerID);
    const cityID = Number(data.cityID);
    const packageTypeID = Number(data.packageTypeID);
    const vehicleID = Number(data.vehicleID);
    const locationID = Number(data.locationID);
    const reservationRefusalID = Number(data.reservationRefusalID);
    return {
      reservationRefusalID: isNaN(reservationRefusalID) ? -1 : reservationRefusalID,
      customerID: isNaN(customerID) ? 0 : customerID,
      cityID: isNaN(cityID) ? 0 : cityID,
      packageTypeID: isNaN(packageTypeID) ? 0 : packageTypeID,
      vehicleID: isNaN(vehicleID) ? 0 : vehicleID,
      pickUpDateString: pickUpDateString || '',
      pickUpTimeString: pickUpTimeString || '',
      locationID: isNaN(locationID) ? 0 : locationID,
      remarks: (data.remarks || '').trim(),
      userID: this.generalService.getUserID(),
      activationStatus: data.activationStatus === false || data.activationStatus === 0 ? false : true
    };
  }
}
