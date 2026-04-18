// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SDUnLimitedRate } from './sdUnLimitedRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SDUnLimitedRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "sdUnLimitedRate";
  }
  /** CRUD METHODS */
  getTableData(
    SearchSDUnLimitedRateID:number,
    customerContractID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchSDUnLimitedRateID===0)
    {
      SearchSDUnLimitedRateID=0;
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
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSDUnLimitedRateID + '/'+customerContractID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/sdUnLimitedRateID/Ascending');
  }
  getTableDataSort(
    SearchSDUnLimitedRateID:number,
    customerContractID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchSDUnLimitedRateID===0)
    {
      SearchSDUnLimitedRateID=0;
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
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSDUnLimitedRateID + '/'+customerContractID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SDUnLimitedRate) 
  {
    advanceTable.sdUnLimitedRateID=-1;
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    advanceTable.nextDayChargingString=this.generalService.getTimeFroms(advanceTable.nextDayCharging);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SDUnLimitedRate)
  {
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    advanceTable.nextDayChargingString=this.generalService.getTimeFroms(advanceTable.nextDayCharging);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(sdUnLimitedRateID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ sdUnLimitedRateID);
  }
}
