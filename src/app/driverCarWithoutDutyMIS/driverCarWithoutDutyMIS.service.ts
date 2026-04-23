// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class DriverCarWithoutDutyMISService {
  private API_URL: string = '';
  private API_URL1: string = '';
  private API_URL2: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';

  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "driverCarWithoutDutyMIS";
    // this.API_URL1 = generalService.BaseURL + "driverMIS";
    // this.API_URL2 = generalService.BaseURL + "carMasterMIS";
  }

  /** CRUD METHODS */ 
  //Car///
  getTableData(searchPickupToDate: string, searchlocation:string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
   
    if (searchPickupToDate === "") {
      searchPickupToDate = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL +'/' + 'GetCarMIS'+  "/" + searchPickupToDate + '/' + searchlocation + '/'+ SearchActivationStatus + '/' + PageNumber + '/inventoryID/Dscending');
  }
  getTableDataSort(searchPickupToDate: string, searchlocation:string,  SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchPickupToDate === "") {
      searchPickupToDate = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }
  
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchPickupToDate + '/' + searchlocation + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }
//driver//
  /** CRUD METHODS */
  getTableData1(searchPickupToDate: string, searchlocation:string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
   
    if (searchPickupToDate === "") {
      searchPickupToDate = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchPickupToDate + '/' + searchlocation + '/'+ SearchActivationStatus + '/' + PageNumber + '/driverID/Dscending');
  }
  getTableDataSort1(searchPickupToDate: string, searchlocation:string,  SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchPickupToDate === "") {
      searchPickupToDate = "null";
    }
    if (searchlocation === "") {
      searchlocation = "null";
    }
  
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchPickupToDate + '/' + searchlocation + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }
}
