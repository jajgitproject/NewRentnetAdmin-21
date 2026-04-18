// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerMISService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "customerMIS";
  }


  /** CRUD METHODS */
  getTableData( searchCustomerGroup: string,searchCustomerName: string,PageNumber: number): Observable<any> {

  
    if (searchCustomerGroup === "")
       {
      searchCustomerGroup = "null";
    }
    if (searchCustomerName === "")
       {
      searchCustomerName = "null";
    }
    
    return this.httpClient.get(this.API_URL + "/" + searchCustomerGroup + '/' + searchCustomerName + '/' + PageNumber + '/CustomerID/Ascending');

  }

  getTableDataSort(searchCustomerGroup: string,searchCustomerName: string,PageNumber: number, coloumName: string, sortType: string): Observable<any> {

    if (searchCustomerGroup === "") {
      searchCustomerGroup = "null";
    }
    if (searchCustomerName === "") {
      searchCustomerName = "null";
    }
   
    return this.httpClient.get(this.API_URL + "/" + searchCustomerGroup + '/' + searchCustomerName + '/'+ PageNumber + '/' + coloumName + '/' + sortType);

  }

}
