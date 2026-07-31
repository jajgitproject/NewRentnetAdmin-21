// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ChangeVendorModel } from './changeVendor.model';
@Injectable()
export class ChangeVendorService {
  private API_URL: string = '';
  private API_URL_Customer: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "changePassenger";
    this.API_URL_Customer = generalService.BaseURL + "customer";
  }

  /** CRUD METHODS */
  private toRouteParam(value: any): string {
    if (value === null || value === undefined || value === '') {
      return 'null';
    }
    return encodeURIComponent(String(value));
  }

  getTableData(SearchCustomerGroup:any,SearchCustomerName:any,SearchCity:any,SearchVehicle:any,SearchPackageType:any,SearchPakcage:any,
              SearchFromDate:any,SearchToDate:any,SearchReservationID:any,SearchDutySlipID:any,SearchActivationStatus:any,PageNumber:number,
              SearchVendor:any = null):Observable<any> 
  {
    let url = `${this.API_URL}/${this.toRouteParam(SearchCustomerGroup)}/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchCity)}/${this.toRouteParam(SearchVehicle)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPakcage)}/${this.toRouteParam(SearchFromDate)}/${this.toRouteParam(SearchToDate)}/${this.toRouteParam(SearchReservationID)}/${this.toRouteParam(SearchDutySlipID)}/${SearchActivationStatus}/${PageNumber}/ReservationID/Descending`;
    if (SearchVendor) {
      url += `?Vendor=${this.toRouteParam(SearchVendor)}`;
    }
    return this.httpClient.get(url);
  }


  getTableDataSort(SearchCustomerGroup:any,SearchCustomerName:any,SearchCity:any,SearchVehicle:any,SearchPackageType:any,SearchPakcage:any,
                   SearchFromDate:any,SearchToDate:any,SearchReservationID:any,SearchDutySlipID:any,SearchActivationStatus:any,PageNumber:number,
                   coloumName:string,sortType:string,SearchVendor:any = null):Observable<any> 
  {
    let url = `${this.API_URL}/${this.toRouteParam(SearchCustomerGroup)}/${this.toRouteParam(SearchCustomerName)}/${this.toRouteParam(SearchCity)}/${this.toRouteParam(SearchVehicle)}/${this.toRouteParam(SearchPackageType)}/${this.toRouteParam(SearchPakcage)}/${this.toRouteParam(SearchFromDate)}/${this.toRouteParam(SearchToDate)}/${this.toRouteParam(SearchReservationID)}/${this.toRouteParam(SearchDutySlipID)}/${SearchActivationStatus}/${PageNumber}/${coloumName}/${sortType}`;
    if (SearchVendor) {
      url += `?Vendor=${this.toRouteParam(SearchVendor)}`;
    }
    return this.httpClient.get(url);
  }


  getCustomersForMessage():Observable<any[]> 
  {
    return this.httpClient.get<any[]>(this.API_URL_Customer + "/GetCustomersForMessage");
  }


  add(advanceTable:ChangeVendorModel):Observable<any> 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.changeEmployeeID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL + '/' + 'AddChangeVendor' , advanceTable);
  }

  getChangeVendorData(ReservationID:number):Observable<any[]> 
  {
    return this.httpClient.get<any[]>(this.API_URL + "/GetAllChangePassenger" + '/' + ReservationID);
  }

  getInventory(VendorID:number):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL + '/GetInventoryForDropDown' + '/' + VendorID);
  }

}
