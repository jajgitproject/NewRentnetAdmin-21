// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GSTPercentage } from './gstPercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class GSTPercentageService {
  private API_URL: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "gstPercentage";
  }
  /** CRUD METHODS */
  getTableData(searchigstPercentage: string, searchcgstPercentage: string, searchsgstPercentage: string, SearchActivationStatus: boolean, PageNumber: number): Observable<any> {
    if (searchigstPercentage === "") {
      searchigstPercentage = "null";
    }
    if (searchcgstPercentage === "") {
      searchcgstPercentage = "null";
    }

    if (searchsgstPercentage === "") {
      searchsgstPercentage = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchigstPercentage + '/' + searchcgstPercentage + '/' + searchsgstPercentage + '/' + SearchActivationStatus + '/' + PageNumber + '/gstPercentageID/Ascending');
  }
  getTableDataSort(searchigstPercentage: string, searchcgstPercentage: string, searchsgstPercentage: string, SearchActivationStatus: boolean, PageNumber: number, coloumName: string, sortType: string): Observable<any> {
    if (searchigstPercentage === "") {
      searchigstPercentage = "null";
    }
    if (searchcgstPercentage === "") {
      searchcgstPercentage = "null";
    }

    if (searchsgstPercentage === "") {
      searchsgstPercentage = "null";
    }
    if (SearchActivationStatus === null) {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + searchigstPercentage + '/' + searchcgstPercentage + '/' + searchsgstPercentage + '/' + SearchActivationStatus + '/' + PageNumber + '/' + coloumName + '/' + sortType);
  }
  add(advanceTable: GSTPercentage) {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.gstPercentageID = -1;
    return this.httpClient.post<any>(this.API_URL, advanceTable);
  }
  update(advanceTable: GSTPercentage) {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL, advanceTable);
  }
  delete(gstPercentageID: number): Observable<any> {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/' + gstPercentageID + '/'+ userID);
  }
}
