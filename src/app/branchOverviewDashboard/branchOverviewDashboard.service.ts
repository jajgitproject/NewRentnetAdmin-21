// @ts-nocheck

import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { GeneralService } from '../general/general.service';



@Injectable()

export class BranchOverviewDashboardService {

  private API_URL = '';



  constructor(private httpClient: HttpClient, public generalService: GeneralService) {

    this.API_URL = generalService.BaseURL + 'branchOverviewDashboard';

  }



  getBranches(userID: number): Observable<any[]> {

    return this.httpClient.get<any[]>(this.API_URL + '/branches', {

      params: new HttpParams().set('userID', String(userID)),

    });

  }



  getCustomers(branchID: number, userID: number): Observable<any[]> {

    return this.httpClient.get<any[]>(this.API_URL + '/customers', {

      params: new HttpParams().set('branchID', String(branchID)).set('userID', String(userID)),

    });

  }



  getLocations(branchID: number, userID: number): Observable<any[]> {

    return this.httpClient.get<any[]>(this.API_URL + '/locations', {

      params: new HttpParams().set('branchID', String(branchID)).set('userID', String(userID)),

    });

  }



  getDutyTypes(): Observable<any[]> {

    return this.httpClient.get<any[]>(this.API_URL + '/dutyTypes');

  }



  getSummary(

    branchID: number,

    dateFrom: string,

    dateTo: string,

    userID: number,

    customerID: number | null,

    locationID: number | null,

    packageTypeID: number | null

  ): Observable<any> {

    let params = new HttpParams()

      .set('branchID', String(branchID))

      .set('dateFrom', dateFrom)

      .set('dateTo', dateTo)

      .set('userID', String(userID));

    if (customerID != null) {

      params = params.set('customerID', String(customerID));

    }

    if (locationID != null) {

      params = params.set('locationID', String(locationID));

    }

    if (packageTypeID != null) {

      params = params.set('packageTypeID', String(packageTypeID));

    }

    return this.httpClient.get<any>(this.API_URL + '/summary', { params });

  }

  getBookingDetails(
    branchID: number,
    dateFrom: string,
    dateTo: string,
    metricKey: string,
    userID: number,
    customerID: number | null,
    locationID: number | null,
    packageTypeID: number | null
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('branchID', String(branchID))
      .set('dateFrom', dateFrom)
      .set('dateTo', dateTo)
      .set('metricKey', metricKey)
      .set('userID', String(userID));
    if (customerID != null) params = params.set('customerID', String(customerID));
    if (locationID != null) params = params.set('locationID', String(locationID));
    if (packageTypeID != null) params = params.set('packageTypeID', String(packageTypeID));
    return this.httpClient.get<any[]>(this.API_URL + '/bookingDetails', { params });
  }

  getBookingHeaders(
    branchID: number,
    dateFrom: string,
    dateTo: string,
    metricKey: string,
    userID: number,
    customerID: number | null,
    locationID: number | null,
    packageTypeID: number | null,
    page = 1,
    pageSize = 100
  ): Observable<any> {
    let params = new HttpParams()
      .set('branchID', String(branchID))
      .set('dateFrom', dateFrom)
      .set('dateTo', dateTo)
      .set('metricKey', metricKey)
      .set('userID', String(userID))
      .set('page', String(page))
      .set('pageSize', String(pageSize));
    if (customerID != null) params = params.set('customerID', String(customerID));
    if (locationID != null) params = params.set('locationID', String(locationID));
    if (packageTypeID != null) params = params.set('packageTypeID', String(packageTypeID));
    return this.httpClient.get<any>(this.API_URL + '/bookingHeaders', { params });
  }

}

