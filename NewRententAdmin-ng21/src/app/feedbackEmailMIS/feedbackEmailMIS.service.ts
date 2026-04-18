// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class FeedbackEmailMISService {
  private API_URL: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) {
    this.API_URL = generalService.BaseURL + "feedbackEmailMIS";
  }


  /** CRUD METHODS */
  getTableData(searchDutySlipID: string, searchFromDate: string, 
    searchToDate: string,PageNumber: number): Observable<any> {

    if (searchDutySlipID === "") {
      searchDutySlipID = "null";
    }
    if (searchFromDate === "") {
      searchFromDate = "null";
    }
    if (searchToDate === "") {
      searchToDate = "null";
    }
    return this.httpClient.get(this.API_URL + "/"  + searchDutySlipID + '/' + searchFromDate + '/' + searchToDate + '/' + PageNumber + '/DutySlipID/Ascending');

  }

  getTableDataSort( searchDutySlipID: string,searchFromDate: string,searchToDate: string, 
    PageNumber: number, coloumName: string, sortType: string): Observable<any> {

      if (searchDutySlipID === "") {
        searchDutySlipID = "null";
      }
    
    if (searchFromDate === "") {
      searchFromDate = "null";
    }
    if (searchToDate === "") {
      searchToDate = "null";
    }
    return this.httpClient.get(this.API_URL + "/" + searchDutySlipID +'/'+ searchFromDate + '/' + searchToDate + '/'+ PageNumber + '/' + coloumName + '/' + sortType);

  }

}
