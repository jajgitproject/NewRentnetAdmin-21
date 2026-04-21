// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { TallyMis } from './tallyMis.model';
import { OrganizationalEntity } from '../organizationalEntity/organizationalEntity.model';
import { OrganizationalEntityDropDown } from '../organizationalEntityMessage/organizationalEntityDropDown.model';
@Injectable()
export class TallyMisService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "MISTally";
  }

  /** CRUD METHODS */
  getTableData(
    SearchRequestFromDate: string,
    SearchRequestToDate: string,
    SearchLocation: string,
    PageNumber: number): Observable<any> {
      
    if (SearchRequestFromDate === "") {
      SearchRequestFromDate = "null";
    }
    if (SearchRequestToDate === "") {
      SearchRequestToDate = "null";
    }
    if (SearchLocation === "") {
      SearchLocation = "null";
    }
    
    return this.httpClient.get(this.API_URL + '/' + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchLocation + '/' + PageNumber + '/InvoiceID/Ascending');

  }

  getTableDataSort(
    SearchRequestFromDate: string,
    SearchRequestToDate: string,
    SearchLocation: string,
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if (SearchRequestFromDate === "") {
      SearchRequestFromDate = "null";
    }
    if (SearchRequestToDate === "") {
      SearchRequestToDate = "null";
    }
    if (SearchLocation === "") {
      SearchLocation = "null";
    }
    
    return this.httpClient.get(this.API_URL + "/" + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchLocation + '/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  exportExcel(
    SearchRequestFromDate: string,
    SearchRequestToDate: string,
    SearchLocation: string,
    PageNumber: number,
    coloumName: string,
    sortType: string): Observable<any> {
    if (SearchRequestFromDate === "") {
      SearchRequestFromDate = "null";
    }
    if (SearchRequestToDate === "") {
      SearchRequestToDate = "null";
    }
    if (SearchLocation === "") {
      SearchLocation = "null";
    }

    return this.httpClient.get(this.API_URL + "/ExportExcel/" + SearchRequestFromDate + '/' + SearchRequestToDate + '/' + SearchLocation + '/' + PageNumber + '/' + coloumName + '/' + sortType, { responseType: 'blob' });
  }

   GetLocation(): Observable<OrganizationalEntityDropDown[]> 
  {
    return this.httpClient.get<OrganizationalEntityDropDown[]>(this.generalService.BaseURL + "organizationalEntity/ForLocationDropDown");
  }
 

}

