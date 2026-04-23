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
  getTableData(SearchCustomerGroup:any,SearchCustomerName:any,SearchCity:any,SearchVehicle:any,SearchPackageType:any,SearchPakcage:any,
              SearchFromDate:any,SearchToDate:any,SearchReservationID:any,SearchDutySlipID:any,SearchActivationStatus:any,PageNumber:number):Observable<any> 
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


  getTableDataSort(SearchCustomerGroup:any,SearchCustomerName:any,SearchCity:any,SearchVehicle:any,SearchPackageType:any,SearchPakcage:any,
                   SearchFromDate:any,SearchToDate:any,SearchReservationID:any,SearchDutySlipID:any,SearchActivationStatus:any,PageNumber:number,
                   coloumName:string,sortType:string):Observable<any> 
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
