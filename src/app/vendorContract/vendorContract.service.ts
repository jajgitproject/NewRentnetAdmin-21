// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { VendorContractModel } from './vendorContract.model';
@Injectable()
export class VendorContractService 
{
  private API_URL:string = '';
  private API_URL_Pack:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  { 
    this.API_URL=generalService.BaseURL+ "vendorContract";
    this.API_URL_Pack=generalService.BaseURL+ "VendorContractPackageTypeMapping";
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
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/'+SearchValidFrom + '/'+SearchValidTo + '/' + SearchActivationStatus +'/' + PageNumber + '/vendorContractID/Ascending');
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
  add(advanceTable: VendorContractModel) 
  {
    advanceTable.vendorContractID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.vendorContractValidFromString=this.generalService.getTimeApplicable(advanceTable.vendorContractValidFrom);
    advanceTable.vendorContractValidToString=this.generalService.getTimeApplicableTO(advanceTable.vendorContractValidTo);
    advanceTable.copiedFromID=0;
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: VendorContractModel)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.vendorContractValidFromString=this.generalService.getTimeApplicable(advanceTable.vendorContractValidFrom);
    advanceTable.vendorContractValidToString=this.generalService.getTimeApplicableTO(advanceTable.vendorContractValidTo);
    advanceTable.copiedFromID=0;
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(vendorContractID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ vendorContractID+ '/'+ userID);
  }

  getPackageTypeByVendorContractID(vendorContractID:number): Observable<any[]> 
  {
    return this.httpClient.get<any[]>(this.API_URL_Pack + "/GetPackageTypeForVendorContract/" +vendorContractID);
  }

}
