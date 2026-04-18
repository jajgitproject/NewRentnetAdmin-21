// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractCDCLocalOnDemand } from './supplierContractCDCLocalOnDemand.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractCDCLocalOnDemandService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractCDCLocalOnDemand";
  }
  /** CRUD METHODS */
  getTableData(
    SearchSupplierContractCDCLocalOnDemandID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchSupplierContractCDCLocalOnDemandID===0)
    {
      SearchSupplierContractCDCLocalOnDemandID=0;
    }
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCityTier==="")
    {
      SearchCityTier="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractCDCLocalOnDemandID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+'/'+SearchBaseRate +'/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractCDCLocalOnDemandID/Ascending');
  }
  getTableDataSort(
    SearchSupplierContractCDCLocalOnDemandID:number,
    SupplierContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchSupplierContractCDCLocalOnDemandID===0)
    {
      SearchSupplierContractCDCLocalOnDemandID=0;
    }
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCityTier==="")
    {
      SearchCityTier="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierContractCDCLocalOnDemandID + '/'+SupplierContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContractCDCLocalOnDemand) 
  {
    advanceTable.supplierContractCDCLocalOnDemandID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractCDCLocalOnDemand)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractCDCLocalOnDemandID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractCDCLocalOnDemandID + '/'+ userID);
  }
}
