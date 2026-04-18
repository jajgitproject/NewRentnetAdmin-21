// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractSDCSelfDriveHourlyLimited } from './supplierContractSDCSelfDriveHourlyLimited.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractSDCSelfDriveHourlyLimitedService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractSDCSelfDriveHourlyLimited";
  }
  /** CRUD METHODS */
  getTableData(
    SearchSupplierContractSDCSelfDriveHourlyLimitedID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchHrs:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchSupplierContractSDCSelfDriveHourlyLimitedID===0)
    {
      SearchSupplierContractSDCSelfDriveHourlyLimitedID=0;
    }
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCityTier==="")
    {
      SearchCityTier="null";
    }
    if(SearchPackage==="")
    {
      SearchPackage="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchHrs==="")
      {
        SearchHrs="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractSDCSelfDriveHourlyLimitedID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate+ '/'+SearchHrs+ '/'+SearchActivationStatus +'/' + PageNumber + '/supplierContractSDCSelfDriveHourlyLimitedID/Ascending');
  }
  getTableDataSort(
    SearchSupplierContractSDCSelfDriveHourlyLimitedID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchHrs:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchSupplierContractSDCSelfDriveHourlyLimitedID===0)
    {
      SearchSupplierContractSDCSelfDriveHourlyLimitedID=0;
    }
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCityTier==="")
    {
      SearchCityTier="null";
    }
    if(SearchPackage==="")
    {
      SearchPackage="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchHrs==="")
      {
        SearchHrs="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractSDCSelfDriveHourlyLimitedID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate+'/'+SearchHrs +'/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContractSDCSelfDriveHourlyLimited) 
  {
    advanceTable.supplierContractSDCSelfDriveHourlyLimitedID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractSDCSelfDriveHourlyLimited)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractSDCSelfDriveHourlyLimitedID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractSDCSelfDriveHourlyLimitedID + '/'+ userID);
  }
}
