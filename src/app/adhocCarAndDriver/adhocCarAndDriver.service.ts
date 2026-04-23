// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { AdhocCarAndDriver } from './adhocCarAndDriver.model';
@Injectable()
export class AdhocCarAndDriverService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "adhocCarAndDriver";
  }
  
  /** CRUD METHODS */
  add(advanceTable: AdhocCarAndDriver) 
  {
    if(advanceTable.driverID === null)
      {
      advanceTable.driverID=-1;
    }
    if(advanceTable.inventoryID ===null)
      {
      advanceTable.inventoryID=-1;
    }
    if(advanceTable.supplierID === null)
      {
      advanceTable.supplierID=-1;
    }
     if(advanceTable.rtoStateID === null)
      {
      advanceTable.rtoStateID=0;
       advanceTable.rtoState=null;
    }
     if(advanceTable.driverFatherName === '')
    {
       advanceTable.driverFatherName=null;
    }

     if(advanceTable.driverEmail === '')
    {
       advanceTable.driverEmail=null;
    }
     if(advanceTable.supplierEmail === '')
    {
       advanceTable.supplierEmail=null;
    }
    advanceTable.createdByEmployeeID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  GetVendorDetails(supplierID:number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL  + "/GetVendorDetails/"+supplierID);
  }
  GetDriverDetails(driverID:number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL + "/GetDriverDetails/"+driverID);
  }
  GetInventoryDetails(RegistrationNumber:string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL  + "/GetInventoryDetails/"+RegistrationNumber);
  }
  GetSupplierTypeDetails(SupplierType:string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.API_URL  + "/GetSupplierTypeDetails/"+SupplierType);
  }
}
