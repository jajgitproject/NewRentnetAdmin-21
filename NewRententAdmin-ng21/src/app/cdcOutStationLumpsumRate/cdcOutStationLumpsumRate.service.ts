// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CDCOutStationLumpsumRate } from './cdcOutStationLumpsumRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CDCOutStationLumpsumRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "cdcOutStationLumpsumRate";
  }
  /** CRUD METHODS */
  getTableData(
    CDCOutStationLumpsumRateID:number,
    CustomerContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(CDCOutStationLumpsumRateID===0)
    {
      CDCOutStationLumpsumRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +CDCOutStationLumpsumRateID + '/'+CustomerContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/CDCOutStationLumpsumRateID/Ascending');
  }
  getTableDataSort(
    CDCOutStationLumpsumRateID:number,
    CustomerContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(CDCOutStationLumpsumRateID===0)
    {
      CDCOutStationLumpsumRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +CDCOutStationLumpsumRateID + '/'+CustomerContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CDCOutStationLumpsumRate) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.cdcOutStationLumpsumRateID=-1;
    if(advanceTable.nightChargeable === false)
    {
      advanceTable.graceMinutesForNightCharge = 0;
      advanceTable.graceMinutesNightChargeAmount = 0;
    }
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CDCOutStationLumpsumRate)
  {
    advanceTable.userID=this.generalService.getUserID();
    if(advanceTable.nightChargeable === false)
    {
      advanceTable.graceMinutesForNightCharge = 0;
      advanceTable.graceMinutesNightChargeAmount = 0;
    }
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cdcOutStationLumpsumRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cdcOutStationLumpsumRateID + '/'+ userID);
  }
}
