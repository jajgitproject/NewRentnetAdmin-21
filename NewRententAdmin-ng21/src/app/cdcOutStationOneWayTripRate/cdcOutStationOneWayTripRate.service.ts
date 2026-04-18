// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CDCOutStationOneWayTripRate } from './cdcOutStationOneWayTripRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CDCOutStationOneWayTripRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "cdcOutStationOneWayTripRate";
  }
  /** CRUD METHODS */
  getTableData(
    CDCOutStationOneWayTripRateID:number,
    CustomerContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(CDCOutStationOneWayTripRateID===0)
    {
      CDCOutStationOneWayTripRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +CDCOutStationOneWayTripRateID + '/'+CustomerContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/CDCOutStationOneWayTripRateID/Ascending');
  }
  getTableDataSort(
    CDCOutStationOneWayTripRateID:number,
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
    if(CDCOutStationOneWayTripRateID===0)
    {
      CDCOutStationOneWayTripRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +CDCOutStationOneWayTripRateID + '/'+CustomerContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CDCOutStationOneWayTripRate) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.cdcOutStationOneWayTripRateID=-1;
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CDCOutStationOneWayTripRate)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cdcOutStationOneWayTripRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cdcOutStationOneWayTripRateID + '/'+ userID);
  }

  duplicateInsert(advanceTable: CDCOutStationOneWayTripRate) 
  {
    advanceTable.cdcOutStationOneWayTripRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL+"/"+"Duplicate" , advanceTable);
  }
}
