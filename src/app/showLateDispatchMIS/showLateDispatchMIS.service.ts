// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ShowLateDispatchMISService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "lateAllotmentMIS";
  }
  private toRouteParam(value: string): string
  {
    const routeValue = value === '' ? 'null' : value;
    return encodeURIComponent(routeValue);
  }

  /** CRUD METHODS */
  getTableData(SearchFromDate:string,SearchToDate:string,SearchServiceLocation:string,SearchTimeDiff:number,PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(
      this.API_URL + '/getAllLateDispatch/' +
      this.toRouteParam(SearchFromDate) + '/' +
      this.toRouteParam(SearchToDate) + '/' +
      this.toRouteParam(SearchServiceLocation) + '/' +
      SearchTimeDiff + '/' +
      PageNumber + '/ReservationID/Descending'
    );
  }

  getTableDataSort(SearchFromDate:string,SearchToDate:string,SearchServiceLocation:string,SearchTimeDiff:number,PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    return this.httpClient.get(
      this.API_URL + '/getAllLateDispatch/' +
      this.toRouteParam(SearchFromDate) + '/' +
      this.toRouteParam(SearchToDate) + '/' +
      this.toRouteParam(SearchServiceLocation) + '/' +
      SearchTimeDiff + '/' +
      PageNumber + '/' +
      encodeURIComponent(coloumName) + '/' +
      encodeURIComponent(sortType)
    );
  }

  downloadCsv(SearchFromDate:string,SearchToDate:string,SearchServiceLocation:string,SearchTimeDiff:number): Observable<Blob>
  {
    return this.httpClient.get(
      this.API_URL + '/exportLateDispatch/' +
      this.toRouteParam(SearchFromDate) + '/' +
      this.toRouteParam(SearchToDate) + '/' +
      this.toRouteParam(SearchServiceLocation) + '/' +
      SearchTimeDiff,
      { responseType: 'blob' }
    );
  }
  
}
  

