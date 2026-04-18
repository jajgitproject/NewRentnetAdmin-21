// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractCustomerCityPercentage } from './supplierContractCustomerCityPercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractCustomerCityPercentageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractCustomerCityPercentage";
  }
  /** CRUD METHODS */
  getTableData(SearchSupplierCustomerPercentageForAllID:number,
    SupplierContract_ID:number,
    SearchCustomer:string,
    SearchCity:string,
    SearchFromDate:string,
    SearchToDate:string,
    searchsupplierPercentage:string, 
    SearchActivationStatus:boolean, 
    PageNumber: number):  Observable<any> 
  {
    if(SearchSupplierCustomerPercentageForAllID===0)
    {
      SearchSupplierCustomerPercentageForAllID=0;
    }
    if(SearchCustomer==="")
    {
      SearchCustomer="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }

    if(SearchToDate==="")
    {
      SearchToDate="null";
    }
    if(searchsupplierPercentage==="")
      {
        searchsupplierPercentage="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierCustomerPercentageForAllID + '/'+SupplierContract_ID + '/'+SearchCustomer + '/'+SearchCity+ '/'+SearchFromDate + '/'+SearchToDate + '/' +searchsupplierPercentage + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractCustomerCityPercentageID/Ascending');
  }
  getTableDataSort(SearchSupplierCustomerPercentageForAllID:number,
    SupplierContract_ID:number,
    SearchCustomer:string,
    SearchCity:string,
    SearchFromDate:string,
    SearchToDate:string,
    searchsupplierPercentage:string, 
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SearchSupplierCustomerPercentageForAllID===0)
    {
      SearchSupplierCustomerPercentageForAllID=0;
    }
    if(SearchCustomer==="")
    {
      SearchCustomer="null";
    }
    if(SearchCity==="")
    {
      SearchCity="null";
    }
    if(SearchFromDate==="")
      {
        SearchFromDate="null";
      }
      if(SearchToDate==="")
      {
        SearchToDate="null";
      }
       
    if(searchsupplierPercentage==="")
      {
        searchsupplierPercentage="null";
      }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierCustomerPercentageForAllID + '/'+SupplierContract_ID + '/'+SearchCustomer + '/'+SearchCity + '/'+SearchFromDate + '/'+SearchToDate + '/' +searchsupplierPercentage + '/'+ SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierContractCustomerCityPercentage) 
  {
    advanceTable.supplierContractCustomerCityPercentageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractCustomerCityPercentage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractCustomerCityPercentageID: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractCustomerCityPercentageID + '/'+ userID);
  }
}
