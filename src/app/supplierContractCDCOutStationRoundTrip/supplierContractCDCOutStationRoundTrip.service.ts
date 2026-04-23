// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractCDCOutStationRoundTrip } from './supplierContractCDCOutStationRoundTrip.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractCDCOutStationRoundTripService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractCDCOutStationRoundTrip";
  }
  /** CRUD METHODS */
  getTableData(supplierContractID:number,
    searchVehicleCategory:string,
    searchPackage:string,
    searchCityTier:string, 
    searchratePerDay:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(supplierContractID === undefined)
    {
      supplierContractID=0;
    }
    if(searchVehicleCategory==="")
    {
      searchVehicleCategory="null";
    }
    if(searchPackage==="")
    {
      searchPackage="null";
    }
    if(searchCityTier==="")
    {
      searchCityTier="null";
    }
    if(searchratePerDay==="")
      {
        searchratePerDay="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +supplierContractID + '/'+searchVehicleCategory + '/'+searchPackage + '/'+searchCityTier + '/' +searchratePerDay + '/' + SearchActivationStatus +'/' + PageNumber + '/SupplierContractCDCOutStationRoundTripID/Ascending');
    
  }
  getTableDataSort(supplierContractID:number,
    searchVehicleCategory:string,
    searchPackage:string,
    searchCityTier:string, 
    searchratePerDay:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(supplierContractID===undefined)
    {
      supplierContractID=0;
    }
    if(searchVehicleCategory==="")
    {
      searchVehicleCategory="null";
    }
    if(searchPackage==="")
    {
      searchPackage="null";
    }
    if(searchCityTier==="")
    {
      searchCityTier="null";
    }
    if(searchratePerDay==="")
      {
        searchratePerDay="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +supplierContractID + '/'+searchVehicleCategory + '/'+searchPackage + '/'+searchCityTier + '/' +searchratePerDay + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContractCDCOutStationRoundTrip) 
  {
    advanceTable.supplierContractCDCOutStationRoundTripID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargeEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractCDCOutStationRoundTrip)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargeEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractCDCOutStationRoundTripID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractCDCOutStationRoundTripID + '/'+ userID);
  }
}
