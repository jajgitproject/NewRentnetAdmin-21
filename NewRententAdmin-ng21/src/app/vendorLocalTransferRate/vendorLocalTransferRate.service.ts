// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VendorLocalTransferRate } from './vendorLocalTransferRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class VendorLocalTransferRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "vendorLocalTransferRate";
  }
  /** CRUD METHODS */
  getTableData(
    SearchVendorLocalTransferRateID:number,
    vendorContractID:number, 
    SearchVehicleCategory:string,
    SearchCity:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchVendorLocalTransferRateID===0)
    {
      SearchVendorLocalTransferRateID=0;
    }
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchPackage==="")
    {
      SearchPackage="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchVendorLocalTransferRateID + '/'+vendorContractID+ '/'+SearchVehicleCategory+ '/'+SearchCity+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/vendorLocalTransferRateID/Ascending');
  }
  getTableDataSort(
    SearchVendorLocalTransferRateID:number,
    vendorContractID:number, 
    SearchVehicleCategory:string,
    SearchCity:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchVendorLocalTransferRateID===0)
    {
      SearchVendorLocalTransferRateID=0;
    }
    if(SearchVehicleCategory==="")
    {
      SearchVehicleCategory="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchPackage==="")
    {
      SearchPackage="null";
    }
    if(SearchBaseRate==="")
    {
      SearchBaseRate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchVendorLocalTransferRateID + '/'+vendorContractID+ '/'+SearchVehicleCategory+ '/'+SearchCity+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: VendorLocalTransferRate) 
  {
    advanceTable.vendorLocalTransferRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: VendorLocalTransferRate)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(vendorLocalTransferRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorLocalTransferRateID + '/'+ userID);
  }

  duplicateInsert(advanceTable: VendorLocalTransferRate) 
  {
    advanceTable.vendorLocalTransferRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    return this.httpClient.post<any>(this.API_URL+"/"+"Duplicate" , advanceTable);
  }
}
