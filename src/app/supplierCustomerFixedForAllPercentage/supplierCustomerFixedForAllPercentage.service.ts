// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierCustomerFixedForAllPercentage } from './supplierCustomerFixedForAllPercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierCustomerFixedForAllPercentageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierCustomerFixedForAllPercentage";
  }
  /** CRUD METHODS */
  getTableData(SearchSupplierCustomerPercentageForAllID:number,
    SearchCustomer:string,
    SearchFromDate:string,
    SearchToDate:string, 
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

    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }

    if(SearchToDate==="")
    {
      SearchToDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierCustomerPercentageForAllID + '/'+SearchCustomer + '/'+SearchFromDate + '/'+SearchToDate + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierCustomerFixedPercentageForAllID/Ascending');
  }
  getTableDataSort(SearchSupplierCustomerPercentageForAllID:number,
    SearchCustomer:string,
    SearchFromDate:string,
    SearchToDate:string, 
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

    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }

    if(SearchToDate==="")
    {
      SearchToDate="null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchSupplierCustomerPercentageForAllID + '/'+SearchCustomer + '/'+SearchFromDate + '/'+SearchToDate + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: SupplierCustomerFixedForAllPercentage) 
  {
    advanceTable.supplierCustomerFixedPercentageForAllID=-1;
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierCustomerFixedForAllPercentage)
  {
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierCustomerFixedPercentageForAllID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ supplierCustomerFixedPercentageForAllID);
  }
}
