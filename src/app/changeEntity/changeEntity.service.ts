// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { ChangeEntityModel } from './changeEntity.model';
@Injectable()
export class ChangeEntityService {
  private API_URL: string = '';
  private API_URL_Customer: string = '';
  private API_URL_auth: string = '';
  isTblLoading = true;
  date: any;
  Result: string = 'Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL = generalService.BaseURL + "changeEntity";
    this.API_URL_Customer = generalService.BaseURL + "customer";
  }

  /** CRUD METHODS */
  getTableData(SearchCustomerGroup:string,SearchCustomerName:string,SearchCity:string,SearchVehicle:string,SearchPackageType:string,SearchPakcage:string,
              SearchFromDate: string,SearchToDate: string,SearchReservationID: string,SearchDutySlipID: string,SearchActivationStatus: boolean,PageNumber: number): Observable<any> 
  {
    if (SearchCustomerGroup === "") 
    {
      SearchCustomerGroup = null;
    }
    if (SearchCustomerName === "") 
    {
      SearchCustomerName = null;
    }
    if (SearchCity === "") 
    {
      SearchCity = null;
    }
    if (SearchVehicle === "") 
    {
      SearchVehicle = null;
    }
    if (SearchPackageType === "") 
    {
      SearchPackageType = null;
    }
    if (SearchPakcage === "") 
    {
      SearchPakcage = null;
    }
    if (SearchFromDate === "") 
    {
      SearchFromDate = null;
    }
    if (SearchToDate === "") 
    {
      SearchToDate = null;
    }
    if (SearchReservationID === "") 
    {
      SearchReservationID = null;
    }
    if (SearchDutySlipID === "") 
    {
      SearchDutySlipID = null;
    }
    if(SearchActivationStatus === null) 
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchCustomerGroup + '/' + SearchCustomerName + '/' + SearchCity + '/' + SearchVehicle + '/' + SearchPackageType + '/' + SearchPakcage + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchReservationID + '/'+ SearchDutySlipID + '/' + SearchActivationStatus + '/' + PageNumber + '/ReservationID/Descending');
  }


  getTableDataSort(SearchCustomerGroup:string,SearchCustomerName:string,SearchCity:string,SearchVehicle:string,SearchPackageType:string,SearchPakcage:string,
                   SearchFromDate: string,SearchToDate: string,SearchReservationID: string,SearchDutySlipID: string,SearchActivationStatus: boolean,PageNumber: number,
                   coloumName:string,sortType:string):  Observable<any> 
  {
     if (SearchCustomerGroup === "") 
    {
      SearchCustomerGroup = null;
    }
    if (SearchCustomerName === "") 
    {
      SearchCustomerName = null;
    }
    if (SearchCity === "") 
    {
      SearchCity = null;
    }
    if (SearchVehicle === "") 
    {
      SearchVehicle = null;
    }
    if (SearchPackageType === "") 
    {
      SearchPackageType = null;
    }
    if (SearchPakcage === "") 
    {
      SearchPakcage = null;
    }
    if (SearchFromDate === "") 
    {
      SearchFromDate = null;
    }
    if (SearchToDate === "") 
    {
      SearchToDate = null;
    }  
    if (SearchReservationID === "") 
    {
      SearchReservationID = null;
    }
    if (SearchDutySlipID === "") 
    {
      SearchDutySlipID = null;
    }
    if(SearchActivationStatus === null) 
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + '/' + SearchCustomerGroup + '/' + SearchCustomerName + '/' + SearchCity + '/' + SearchVehicle + '/' + SearchPackageType + '/' + SearchPakcage + '/' + SearchFromDate + '/' + SearchToDate + '/' + SearchReservationID + '/'+ SearchDutySlipID + '/' + SearchActivationStatus + '/' + PageNumber + '/'+coloumName+'/'+sortType);
  }


  getCustomersForMessage():Observable<any[]> 
  {
    return this.httpClient.get<any[]>(this.API_URL_Customer + "/GetCustomersForMessage");
  }


  update(advanceTable: ChangeEntityModel[], CustomerID: number): Observable<any> 
  {
    var userID=this.generalService.getUserID();
    return this.httpClient.put<any>(`${this.API_URL}/UpdateEntity/${CustomerID}/${userID}`,advanceTable);
  }

}
