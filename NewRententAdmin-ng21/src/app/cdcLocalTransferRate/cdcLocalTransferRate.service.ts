// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CDCLocalTransferRate } from './cdcLocalTransferRate.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CDCLocalTransferRateService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "cdcLocalTransferRate";
  }
  /** CRUD METHODS */
  getTableData(
    SearchCDCLocalTransferRateID:number,
    customerContractID:number, 
    SearchVehicleCategory:string,
    SearchCity:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchCDCLocalTransferRateID===0)
    {
      SearchCDCLocalTransferRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +SearchCDCLocalTransferRateID + '/'+customerContractID+ '/'+SearchVehicleCategory+ '/'+SearchCity+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber + '/cdcLocalTransferRateID/Ascending');
  }
  getTableDataSort(
    SearchCDCLocalTransferRateID:number,
    customerContractID:number, 
    SearchVehicleCategory:string,
    SearchCity:string,
    SearchPackage:string,
    SearchBaseRate:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchCDCLocalTransferRateID===0)
    {
      SearchCDCLocalTransferRateID=0;
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
    return this.httpClient.get(this.API_URL + "/" +SearchCDCLocalTransferRateID + '/'+customerContractID+ '/'+SearchVehicleCategory+ '/'+SearchCity+ '/'+SearchPackage+ '/'+SearchBaseRate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CDCLocalTransferRate) 
  {
    advanceTable.cdcLocalTransferRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CDCLocalTransferRate)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(cdcLocalTransferRateID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ cdcLocalTransferRateID + '/'+ userID);
  }

  duplicateInsert(advanceTable: CDCLocalTransferRate) 
  {
    advanceTable.cdcLocalTransferRateID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.nightChargeStartTimeString=this.generalService.getTimeFroms(advanceTable.nightChargeStartTime);
    advanceTable.nightChargeEndTimeString=this.generalService.getTimeToo(advanceTable.nightChargeEndTime);
    return this.httpClient.post<any>(this.API_URL+"/"+"Duplicate" , advanceTable);
  }
}
