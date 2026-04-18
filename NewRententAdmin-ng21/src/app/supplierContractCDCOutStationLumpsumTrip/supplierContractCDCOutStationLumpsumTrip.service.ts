// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractCDCOutStationLumpsumTrip } from './supplierContractCDCOutStationLumpsumTrip.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractCDCOutStationLumpsumTripService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractCDCOutStationLumpsumTrip";
  }
  /** CRUD METHODS */
  getTableData(
    SearchSupplierContractCDCOutStationLumpsumTripID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchPackageRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchSupplierContractCDCOutStationLumpsumTripID===0)
    {
      SearchSupplierContractCDCOutStationLumpsumTripID=0;
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
    if(SearchPackageRate==="")
    {
      SearchPackageRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractCDCOutStationLumpsumTripID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchPackageRate + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractCDCOutStationLumpsumTripID/Ascending');
  }
  getTableDataSort(
    SearchSupplierContractCDCOutStationLumpsumTripID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchPackageRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchSupplierContractCDCOutStationLumpsumTripID===0)
    {
      SearchSupplierContractCDCOutStationLumpsumTripID=0;
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
    if(SearchPackageRate==="")
    {
      SearchPackageRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractCDCOutStationLumpsumTripID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchPackageRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContractCDCOutStationLumpsumTrip) 
  {
    advanceTable.supplierContractCDCOutStationLumpsumTripID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractCDCOutStationLumpsumTrip)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractCDCOutStationLumpsumTripID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractCDCOutStationLumpsumTripID + '/'+ userID);
  }
}
