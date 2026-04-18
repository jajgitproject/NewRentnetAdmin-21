// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContract } from './supplierContract.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContract";
  }
  /** CRUD METHODS */
  getTableData(SearchContractID:number,
    SupplierContractName:string,
    SearchValidFrom:string,
    SearchValidTo:string,
    SearchApprovedBy:string,
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchContractID===0)
    {
      SearchContractID=0;
    }
    if(SupplierContractName==="")
    {
      SupplierContractName="null";
    }
    if(SearchValidFrom==="")
    {
      SearchValidFrom="null";
    }
    if(SearchValidTo==="")
    {
      SearchValidTo="null";
    }
    if(SearchApprovedBy==="")
    {
      SearchApprovedBy="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchContractID  + '/' + SupplierContractName +'/'+SearchValidFrom + '/'+SearchValidTo + '/'+SearchApprovedBy + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractID/Ascending');
  }
  getTableDataSort(SearchContractID:number,
    SupplierContractName:string,
    SearchValidFrom:string,
    SearchValidTo:string,
    SearchApprovedBy:string,
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchContractID===0)
    {
      SearchContractID=0;
    }
    if(SupplierContractName==="")
    {
      SupplierContractName="null";
    }
    if(SearchValidFrom==="")
      {
        SearchValidFrom="null";
      }
    if(SearchValidTo==="")
    {
      SearchValidTo="null";
    }
    if(SearchApprovedBy==="")
    {
      SearchApprovedBy="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchContractID  + '/' + SupplierContractName +'/'+SearchValidFrom + '/'+SearchValidTo + '/'+SearchApprovedBy + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContract) 
  {
    advanceTable.supplierContractID=-1;
    if(advanceTable.gstParking){
      advanceTable.gstParking=true;
    }
    else{
     advanceTable.gstParking=false;
    }
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.copiedFromPreviousContractID=0;
    advanceTable.validFromString=this.generalService.getTimeApplicable(advanceTable.validFrom);
    advanceTable.validToString=this.generalService.getTimeApplicableTO(advanceTable.validTo);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContract)
  {
    if(advanceTable.gstParking){
      advanceTable.gstParking=true;
    }
    else{
     advanceTable.gstParking=false;
    }
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.copiedFromPreviousContractID=0;
    advanceTable.validFromString=this.generalService.getTimeApplicable(advanceTable.validFrom);
    advanceTable.validToString=this.generalService.getTimeApplicableTO(advanceTable.validTo);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractID + '/'+ userID);
  }
}
