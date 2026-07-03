// @ts-nocheck
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeneralService } from '../general/general.service';
@Injectable()
export class AppDutyMISService 
{
  private API_URL:string = '';
  isTblLoading = true;
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "appDutyMIS";
  }

  private toRouteSegment(value: string | boolean | null | undefined): string {
    if (value === '' || value === null || value === undefined) {
      return 'null';
    }
    return encodeURIComponent(String(value));
  }

  /** CRUD METHODS */
  getTableData(searchFromDate:string,searchToDate:string, DispatchLocation:string ,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    return this.httpClient.get(
      `${this.API_URL}/${this.toRouteSegment(searchFromDate)}/${this.toRouteSegment(searchToDate)}/${this.toRouteSegment(DispatchLocation)}/${this.toRouteSegment(SearchActivationStatus)}/${PageNumber}/ReservationID/Descending`
    );
  }

  getTableDataSort(searchFromDate:string,searchToDate:string, DispatchLocation:string ,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    return this.httpClient.get(
      `${this.API_URL}/${this.toRouteSegment(searchFromDate)}/${this.toRouteSegment(searchToDate)}/${this.toRouteSegment(DispatchLocation)}/${this.toRouteSegment(SearchActivationStatus)}/${PageNumber}/${encodeURIComponent(coloumName)}/${encodeURIComponent(sortType)}`
    );
  }

  downloadCsv(searchFromDate: string, searchToDate: string, dispatchLocation: string, searchActivationStatus: boolean): Observable<Blob>
  {
    return this.httpClient.get(
      `${this.API_URL}/export/${this.toRouteSegment(searchFromDate)}/${this.toRouteSegment(searchToDate)}/${this.toRouteSegment(dispatchLocation)}/${this.toRouteSegment(searchActivationStatus)}`,
      { responseType: 'blob' }
    );
  }
}
