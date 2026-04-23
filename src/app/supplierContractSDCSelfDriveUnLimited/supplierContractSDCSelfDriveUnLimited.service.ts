// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractSDCSelfDriveUnLimited } from './supplierContractSDCSelfDriveUnLimited.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractSDCSelfDriveUnLimitedService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractSDCSelfDriveUnLimited";
  }
  /** CRUD METHODS */
  getTableData(supplierContractID:number,
    searchVehicleCategory:string,
    searchPackage:string,
    searchCityTier:string,
    SearchBaseRate:string, 
    SearchminimumDays:string, 
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
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchminimumDays==="")
      {
        SearchminimumDays="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +supplierContractID + '/'+searchVehicleCategory + '/'+searchPackage + '/'+searchCityTier + '/'+SearchBaseRate +'/'+SearchminimumDays +'/'+ SearchActivationStatus +'/' + PageNumber + '/SupplierContractSDCSelfDriveUnLimitedID/Ascending');
    
  }
  getTableDataSort(supplierContractID:number,
    searchVehicleCategory:string,
    searchPackage:string,
    searchCityTier:string, 
    SearchBaseRate:string, 
    SearchminimumDays:string,
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
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchminimumDays==="")
      {
        SearchminimumDays="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +supplierContractID + '/'+searchVehicleCategory + '/'+searchPackage + '/'+searchCityTier + '/' +SearchBaseRate + '/'+SearchminimumDays +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContractSDCSelfDriveUnLimited) 
  {
    advanceTable.supplierContractSDCSelfDriveUnLimitedID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargeEndTime);
    advanceTable.nextDayCriteriaString=this.generalService.getTimeFrom(advanceTable.nextDayCriteria);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractSDCSelfDriveUnLimited)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargeEndTime);
    advanceTable.nextDayCriteriaString=this.generalService.getTimeFrom(advanceTable.nextDayCriteria);

    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractSDCSelfDriveUnLimitedID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractSDCSelfDriveUnLimitedID + '/'+ userID);
  }
}
