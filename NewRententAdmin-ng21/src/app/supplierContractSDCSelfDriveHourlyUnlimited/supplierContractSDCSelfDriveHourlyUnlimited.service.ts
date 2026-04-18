// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractSDCSelfDriveHourlyUnlimited } from './supplierContractSDCSelfDriveHourlyUnlimited.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractSDCSelfDriveHourlyUnlimitedService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractSDCSelfDriveHourlyUnlimited";
  }
  /** CRUD METHODS */
  getTableData(
    SearchSupplierContractSDCSelfDriveHourlyUnlimitedID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchMinimumHRs:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchSupplierContractSDCSelfDriveHourlyUnlimitedID===0)
    {
      SearchSupplierContractSDCSelfDriveHourlyUnlimitedID=0;
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
    if(SearchMinimumHRs==="")
      {
        SearchMinimumHRs="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractSDCSelfDriveHourlyUnlimitedID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/'+SearchMinimumHRs +'/'+ SearchActivationStatus +'/' + PageNumber + '/supplierContractSDCSelfDriveHourlyUnlimitedID/Ascending');
  }
  getTableDataSort(
    SearchSupplierContractSDCSelfDriveHourlyUnlimitedID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchMinimumHRs:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchSupplierContractSDCSelfDriveHourlyUnlimitedID===0)
    {
      SearchSupplierContractSDCSelfDriveHourlyUnlimitedID=0;
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
    if(SearchMinimumHRs==="")
      {
        SearchMinimumHRs="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractSDCSelfDriveHourlyUnlimitedID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate +'/'+SearchMinimumHRs + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContractSDCSelfDriveHourlyUnlimited) 
  {
    advanceTable.supplierContractSDCSelfDriveHourlyUnlimitedID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    advanceTable.nextDayCriteriaString=this.generalService.getTimeFrom(advanceTable.nextDayCriteria);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractSDCSelfDriveHourlyUnlimited)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    advanceTable.nextDayCriteriaString=this.generalService.getTimeFrom(advanceTable.nextDayCriteria);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractSDCSelfDriveHourlyUnlimitedID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID(); 
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractSDCSelfDriveHourlyUnlimitedID + '/'+ userID);
  }
}
