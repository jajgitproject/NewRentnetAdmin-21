// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BookingBackupMISService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "bookingBackupMIS";
  }


  /** CRUD METHODS */
  getTableData(searchModeOfPayment: string, searchServiceLocation: string, 
    searchCustomerName: string, searchDutySlip: string, searchManualDS: string, 
    searchBooking: string, searchCity: string, searchFromDate: string, 
    searchToDate: string, searchSalesPerson: string, searchCancellationFrom: string, 
    searchCancellationTo: string,searchDispatchStatus:string,searchBookingStatus:string,
    searchCustomerLocation:string,searchGuestName:string,
    searchPickupDetail:string,searchPickupSubDetail:string,searchCustomerGroup:string,searchBookerName :string,PageNumber: number): Observable<any> {

    if (searchModeOfPayment === "")
       {
      searchModeOfPayment = "null";
    }
    if (searchServiceLocation === "")
       {
      searchServiceLocation = "null";
    }
    if (searchCustomerName === "")
       {
      searchCustomerName = "null";
    }
    if (searchDutySlip === "") {
      searchDutySlip = "null";
    }
    if (searchManualDS === "") {
      searchManualDS = "null";
    }
    if (searchBooking === "") {
      searchBooking = "null";
    }
    if (searchCity === "") {
      searchCity = "null";
    }
    if (searchFromDate === "") {
      searchFromDate = "null";
    }
    if (searchToDate === "") {
      searchToDate = "null";
    }
    if (searchSalesPerson === "") {
      searchSalesPerson = "null";
    }
    if (searchCancellationFrom === "") {
      searchCancellationFrom = "null";
    }
    if (searchCancellationTo === "") {
      searchCancellationTo = "null";
    }

    if (searchDispatchStatus === "")
    {
      searchDispatchStatus = "null";
    }
    if (searchBookingStatus === "") 
    {
      searchBookingStatus = "null";
    }
     if (searchCustomerLocation === "")
    {
      searchCustomerLocation = "null";
    }
    if (searchGuestName === "") 
    {
      searchGuestName = "null";
    }
     if (searchPickupDetail === "")
    {
      searchPickupDetail = "null";
    }
    if (searchPickupSubDetail === "") 
    {
      searchPickupSubDetail = "null";
    }
    if (searchCustomerGroup === "") 
      {
        searchCustomerGroup = "null";
      }
      if (searchBookerName === "") 
        {
          searchBookerName = "null";
        }
    return this.httpClient.get(this.API_URL + "/" + searchModeOfPayment + '/' + searchServiceLocation + '/' + searchCustomerName + '/' + searchDutySlip + '/' + searchManualDS + '/' + searchBooking + '/' + searchCity + '/' + searchFromDate + '/' + searchToDate + '/' + searchSalesPerson + '/' + searchCancellationFrom + '/' + searchCancellationTo + '/'+ searchDispatchStatus + '/'+ searchBookingStatus + '/'+ searchCustomerLocation + '/'+ searchGuestName + '/'+ searchPickupDetail + '/'+ searchPickupSubDetail + '/'+ searchCustomerGroup + '/'+ searchBookerName + '/' + PageNumber + '/ReservationID/Descending');

  }

  getTableDataSort(searchModeOfPayment: string, searchServiceLocation: string, 
    searchCustomerName: string, searchDutySlip: string,
    searchManualDS: string, searchBooking: string,
    searchCity: string, searchFromDate: string,
    searchToDate: string, searchSalesPerson: string, 
    searchCancellationFrom: string, searchCancellationTo: string,
    searchDispatchStatus:string,searchBookingStatus:string, 
    searchCustomerLocation:string,searchGuestName:string,
    searchPickupDetail:string,searchPickupSubDetail:string,searchCustomerGroup:string,searchBookerName:string,
    PageNumber: number, coloumName: string, sortType: string): Observable<any> {

    if (searchModeOfPayment === "") {
      searchModeOfPayment = "null";
    }
    if (searchServiceLocation === "") {
      searchServiceLocation = "null";
    }
    if (searchCustomerName === "") {
      searchCustomerName = "null";
    }
    if (searchDutySlip === "") {
      searchDutySlip = "null";
    }
    if (searchManualDS === "") {
      searchManualDS = "null";
    }
    if (searchBooking === "") {
      searchBooking = "null";
    }
    if (searchCity === "") {
      searchCity = "null";
    }
    if (searchFromDate === "") {
      searchFromDate = "null";
    }
    if (searchToDate === "") {
      searchToDate = "null";
    }
    if (searchSalesPerson === "") {
      searchSalesPerson = "null";
    }
    if (searchCancellationFrom === "") {
      searchCancellationFrom = "null";
    }
    if (searchCancellationTo === "") 
    {
      searchCancellationTo = "null";
    }
    if (searchDispatchStatus === "")
    {
      searchDispatchStatus = "null";
    }
    if (searchBookingStatus === "") 
    {
      searchBookingStatus = "null";
    }
    if (searchCustomerLocation === "")
    {
      searchCustomerLocation = "null";
    }
    if (searchGuestName === "") 
    {
      searchGuestName = "null";
    }
     if (searchPickupDetail === "")
    {
      searchPickupDetail = "null";
    }
    if (searchPickupSubDetail === "") 
    {
      searchPickupSubDetail = "null";
    }
    if (searchCustomerGroup === "") 
      {
        searchCustomerGroup = "null";
      }
      if (searchBookerName === "") 
        {
          searchBookerName = "null";
        }
    return this.httpClient.get(this.API_URL + "/" + searchModeOfPayment + '/' + searchServiceLocation + '/' + searchCustomerName + '/' + searchDutySlip + '/' + searchManualDS + '/' + searchBooking + '/' + searchCity + '/' + searchFromDate + '/' + searchToDate + '/' + searchSalesPerson + '/' + searchCancellationFrom + '/' + searchCancellationTo + '/'+ searchDispatchStatus + '/'+ searchBookingStatus + '/'+ searchCustomerLocation + '/'+ searchGuestName + '/' + searchPickupDetail + '/'+ searchPickupSubDetail + '/'+ searchCustomerGroup + '/'+ searchPickupSubDetail + '/'+ PageNumber + '/' + coloumName + '/' + sortType);

  }

}
