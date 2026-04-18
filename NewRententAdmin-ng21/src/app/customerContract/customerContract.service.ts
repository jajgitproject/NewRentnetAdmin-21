// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomerContract } from './customerContract.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class CustomerContractService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerContract";
  }
  /** CRUD METHODS */
  getTableData(SearchName:string, 
    SearchValidFrom:string,
    SearchValidTo:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchValidFrom==="")
    {
      SearchValidFrom="null";
    }
    if(SearchValidTo==="")
    {
      SearchValidTo="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+SearchValidFrom + '/'+SearchValidTo + '/' + SearchActivationStatus +'/' + PageNumber + '/customerContractName/Ascending');
  }
  getTableDataSort(SearchName:string, 
    SearchValidFrom:string,
    SearchValidTo:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchValidFrom==="")
    {
      SearchValidFrom="null";
    }
    if(SearchValidTo==="")
    {
      SearchValidTo="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+SearchValidFrom + '/'+SearchValidTo + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: CustomerContract) 
  {
    advanceTable.customerContractID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.modeOfPaymentID=0;
    advanceTable.customerContractValidFromString=this.generalService.getTimeApplicable(advanceTable.customerContractValidFrom);
    advanceTable.customerContractValidToString=this.generalService.getTimeApplicableTO(advanceTable.customerContractValidTo);
    advanceTable.copiedFromID=0;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: CustomerContract)
  {
    advanceTable.modeOfPaymentID=0;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.customerContractValidFromString=this.generalService.getTimeApplicable(advanceTable.customerContractValidFrom);
    advanceTable.customerContractValidToString=this.generalService.getTimeApplicableTO(advanceTable.customerContractValidTo);
    advanceTable.copiedFromID=0;
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(customerContractID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ customerContractID+ '/'+ userID);
  }

}
