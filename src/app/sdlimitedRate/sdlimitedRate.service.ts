// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SDLimitedRate } from './sdlimitedRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SDLimitedRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "sdlimitedRate";
  }
  /** CRUD METHODS */
  getTableData(
    SearchSDLimitedRateID:number,
    customerContractID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchSDLimitedRateID===0)
    {
      SearchSDLimitedRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +SearchSDLimitedRateID + '/'+customerContractID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/sdlimitedRateID/Ascending');
  }
  getTableDataSort(
    SearchSDLimitedRateID:number,
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
    if(SearchSDLimitedRateID===0)
    {
      SearchSDLimitedRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +SearchSDLimitedRateID + '/'+customerContractID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SDLimitedRate) 
  {
    advanceTable.sdLimitedRateID=-1;
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    //advanceTable.nextDayChargingString=this.generalService.getTimeFrom(advanceTable.nextDayCharging);
    advanceTable.nextDayChargingString=this.generalService.getTimeFrom(advanceTable.nextDayCharging);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SDLimitedRate)
  {
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    advanceTable.nextDayChargingString=this.generalService.getTimeFrom(advanceTable.nextDayCharging);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(sdLimitedRateID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ sdLimitedRateID);
  }
}
