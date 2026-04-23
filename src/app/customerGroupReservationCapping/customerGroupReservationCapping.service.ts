// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerGroupReservationCappingModel } from './customerGroupReservationCapping.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { CityDropDown } from '../city/cityDropDown.model';
@Injectable()
export class CustomerGroupReservationCappingService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerGroupReservationCapping";
  }

  /** CRUD METHODS */
  getTableData(CustomerGroupID:number,SearchCity:string,SearchPackageType:string,SearchVehicleCategory:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchCity === "")
    {
      SearchCity = null;
    }
    if(SearchPackageType === "")
    {
      SearchPackageType = null;
    }
    if(SearchVehicleCategory === "")
    {
      SearchVehicleCategory = null;
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + CustomerGroupID + '/' + SearchCity + '/' + SearchPackageType + '/' + SearchVehicleCategory + '/' + SearchActivationStatus +'/' + PageNumber + '/CustomerGroupReservationCappingID/Ascending');
  }

  getTableDataSort(CustomerGroupID:number,SearchCity:string,SearchPackageType:string,SearchVehicleCategory:string,SearchActivationStatus:Boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchCity === "")
    {
      SearchCity = null;
    }
    if(SearchPackageType === "")
    {
      SearchPackageType = null;
    }
    if(SearchVehicleCategory === "")
    {
      SearchVehicleCategory = null;
    }
    if(SearchActivationStatus === null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" + CustomerGroupID + '/' + SearchCity + '/' + SearchPackageType + '/' + SearchVehicleCategory + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: CustomerGroupReservationCappingModel) 
  {
    advanceTable.customerGroupReservationCappingID = -1;
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }

  update(advanceTable: CustomerGroupReservationCappingModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }

  delete(customerGroupReservationCappingID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerGroupReservationCappingID + '/'+ userID);
  }

  GetCityForCustomerGroupCapping(CustomerGroupID:number,PackageTypeID:number,VehicleCategoryID:number): Observable<CityDropDown[]> 
  {
      return this.httpClient.get<CityDropDown[]>(this.API_URL + '/'+ "GetCityForCustomerGroupCapping/" + CustomerGroupID + '/'+ PackageTypeID + '/'+ VehicleCategoryID);
  }

}
  

