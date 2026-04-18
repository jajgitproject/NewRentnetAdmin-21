// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CDCLongTermRentalRate } from './cdcLongTermRentalRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CDCLongTermRentalRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "cdcLongTermRentalRate";
  }
  /** CRUD METHODS */
  getTableData(
    CDCLongTermRentalRateID:number,
    CustomerContract_ID:number, 
    SearchVehicleCategory:string,
    SearchCityTier:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(CDCLongTermRentalRateID===0)
    {
      CDCLongTermRentalRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +CDCLongTermRentalRateID + '/'+CustomerContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/CDCLongTermRentalRateID/Ascending');
  }
  getTableDataSort(
    CDCLongTermRentalRateID:number,
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
    if(CDCLongTermRentalRateID===0)
    {
      CDCLongTermRentalRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +CDCLongTermRentalRateID + '/'+CustomerContract_ID+ '/'+SearchVehicleCategory+ '/'+SearchCityTier+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CDCLongTermRentalRate) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.cdcLongTermRentalRateID=-1;
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CDCLongTermRentalRate)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cdcLongTermRentalRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cdcLongTermRentalRateID + '/'+ userID);
  }

  duplicateInsert(advanceTable: CDCLongTermRentalRate) 
  {
    advanceTable.cdcLongTermRentalRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargesStartTimeString=this.generalService.getTimeFrom(advanceTable.nightChargesStartTime);
    advanceTable.nightChargesEndTimeString=this.generalService.getTimeTo(advanceTable.nightChargesEndTime);
    return this.httpClient.post<any>(this.API_URL+"/"+"Duplicate" , advanceTable);
  }
}
