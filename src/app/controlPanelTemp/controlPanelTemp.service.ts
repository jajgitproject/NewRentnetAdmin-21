// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable({
  providedIn: 'root'
})
export class ControlPanelTempService {
  private API_URL: string = '';
  private User_API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  TripFrom: string;
  TripTo: string;
  constructor(
    private httpClient: HttpClient,
    public datepipe: DatePipe,
    public generalService: GeneralService
  ) {
    this.API_URL = generalService.BaseURL + 'controlPanel/';
    this.User_API_URL = generalService.BaseURL + 'reservationBookerID';
  }

  getReservationDetails(
    SearchBookingNumber: number,
    SearchCars: string,
    SearchCity: string,
    SearchVendors: string,
    SearchDrivers: string,
    searchPackages: string,
    searchPackageTypes: string,
    SearchVehicles: string,
    SearchStatuss: string,
    SearchTripDateFroms: string,
    SearchTripDateTo: string,
    Assignment: string,
    SearchTripNumber: string,
    SearchBooker:string,
    SearchPassenger:string,
    currentPage: number,
    pageSize: number
  ): Observable<any> {
    if (SearchBookingNumber === null || SearchBookingNumber.toString() === '') {
      SearchBookingNumber = 0;
    }
    if (SearchCars === '') {
      SearchCars = 'null';
    }
    if (SearchCity === '') {
      SearchCity = 'null';
    }
    if (SearchVendors === '') {
      SearchVendors = 'null';
    }
    if (SearchDrivers === '') {
      SearchDrivers = 'null';
    }
    if (searchPackages === '') {
      searchPackages = 'null';
    }
    if (searchPackageTypes === '') {
      searchPackageTypes = 'null';
    }
    if (SearchVehicles == '') {
      SearchVehicles = null;
    }
    if (SearchStatuss == '') {
      SearchStatuss = null;
    }
    this.TripFrom = this.datepipe.transform(SearchTripDateFroms, 'yyyy-MM-dd');
    if (this.TripFrom === '') {
      this.TripFrom = 'null';
    }
    this.TripTo = this.datepipe.transform(SearchTripDateTo, 'yyyy-MM-dd');
    if (this.TripTo === '') {
      this.TripTo = 'null';
    }
    if (Assignment.length === 0) {
      Assignment = 'null';
    }
    if (SearchTripNumber === '') {
      SearchTripNumber = 'null';
    }
    if (SearchBooker === '') {
      SearchBooker = 'null';
    }
    if (SearchPassenger === '') {
      SearchPassenger = 'null';
    }
    return this.httpClient.get(
      this.API_URL +
        'getReservationDetails' +
        '/' +
        SearchBookingNumber +
        '/' +
        SearchCars +
        '/' +
        SearchCity +
        '/' +
        SearchVendors +
        '/' +
        SearchDrivers +
        '/' +
        searchPackages +
        '/' +
        searchPackageTypes +
        '/' +
        SearchVehicles +
        '/' +
        SearchStatuss +
        '/' +
        this.TripFrom +
        '/' +
        this.TripTo +
        '/' +
        Assignment +
        '/' +
        SearchTripNumber +
        '/' +
        SearchBooker +
        '/' +
        SearchPassenger +
        '/' +
        currentPage +
        '/' +
        pageSize
    );
  }
}

