// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BankChargeConfig } from './bankChargeConfig.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class BankChargeConfigService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "bankChargeConfig";
  }
  /** CRUD METHODS */
  getTableData(SearchBank:string,
    Search:string,
    SearchCard:string,
    SearchCardPercentage:string,
    SearchIGST:string,
    SearchCardProcessingCharge:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchBank==="")
    {
      SearchBank=null;
    }
    if(Search==="")
    {
      Search=null;
    }
    if(SearchCard==="")
    {
      SearchCard="null";
    }
    if(SearchCardPercentage==="")
    {
      SearchCardPercentage="null";
    }
    if(SearchIGST==="")
    {
      SearchIGST="null";
    }
    if(SearchCardProcessingCharge==="")
    {
      SearchCardProcessingCharge="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchBank+ '/' +Search +"/" +SearchCard+"/" +SearchCardPercentage+"/" +SearchIGST+ '/' +SearchCardProcessingCharge+ '/' + SearchActivationStatus +'/' + PageNumber + '/bankChargeConfigID/Ascending');
  }
  getTableDataSort(SearchBank:string,
    SearchName:string,
    SearchCard:string,
    SearchCardPercentage:string,
    SearchIGST:string,
    SearchCardProcessingCharge:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchBank==="")
    {
      SearchBank=null;
    }
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchCard==="")
    {
      SearchCard="null";
    }
    if(SearchCardPercentage==="")
    {
      SearchCardPercentage="null";
    }
    if(SearchIGST==="")
    {
      SearchIGST="null";
    }
    if(SearchCardProcessingCharge==="")
    {
      SearchCardProcessingCharge="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" + SearchBank+ '/' +SearchName +"/" +SearchCard+"/" +SearchCardPercentage+"/" +SearchIGST + '/' +SearchCardProcessingCharge+ '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: BankChargeConfig) 
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.bankChargeConfigID=-1;
    advanceTable.bankChargeConfigStartDateString=this.generalService.getTimeApplicable(advanceTable.bankChargeConfigStartDate);
    advanceTable.bankChargeConfigEndDateString=this.generalService.getTimeApplicableTO(advanceTable.bankChargeConfigEndDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: BankChargeConfig)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.bankChargeConfigStartDateString=this.generalService.getTimeApplicable(advanceTable.bankChargeConfigStartDate);
    advanceTable.bankChargeConfigEndDateString=this.generalService.getTimeApplicableTO(advanceTable.bankChargeConfigEndDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(bankChargeConfigID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ bankChargeConfigID + '/'+ userID);
  }
}
