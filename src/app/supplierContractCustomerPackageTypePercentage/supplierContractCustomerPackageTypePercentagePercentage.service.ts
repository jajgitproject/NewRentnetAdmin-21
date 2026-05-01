// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractCustomerPackageTypePercentage } from './supplierContractCustomerPackageTypePercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractCustomerPackageTypePercentageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractCustomerPackageTypePercentage";
 
  }
  /** CRUD METHODS */
  getTableData(SupplierContractID:number,
     SearchSupplierContractCustomers:string,
     SearchSupplierContractCustomerPackageTypePercentage:string,
     SearchPercentage:string, 
     SearchFromDate:string,
     SearchToDate:string,
    //  searchsupplierPercentage:string, 
     SearchActivationStatus:boolean, 
     PageNumber: number):  Observable<any> 
  {

    if(SupplierContractID===0)
    {
      SupplierContractID=0;
    }
    if(SearchSupplierContractCustomers==="")
    {
      SearchSupplierContractCustomers="null";
    }
    if(SearchSupplierContractCustomerPackageTypePercentage==="")
    {
      SearchSupplierContractCustomerPackageTypePercentage="null";
    }
    if(SearchPercentage==="")
    {
      SearchPercentage="null";
    }
    if(SearchFromDate==="")
      {
        SearchFromDate="null";
      }
  
      if(SearchToDate==="")
      {
        SearchToDate="null";
      }
      // if(searchsupplierPercentage==="")
      //   {
      //     searchsupplierPercentage="null";
      //   }
    return this.httpClient.get(this.API_URL + '/'+SupplierContractID +'/'+ SearchSupplierContractCustomers+'/'+SearchSupplierContractCustomerPackageTypePercentage +'/'+SearchPercentage +'/'+SearchFromDate + '/'+SearchToDate + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractCustomerPackageTypePercentageID/Ascending');
  }

  getTableDataSort(
    SupplierContractID:number,
    SearchSupplierContractCustomers:string,
    SearchSupplierContractCustomerPackageTypePercentage:string,
    SearchPercentage:string, 
    SearchFromDate:string,
    SearchToDate:string,
    // searchsupplierPercentage:string, 
    SearchActivationStatus:boolean, 
    PageNumber: number,
    coloumName:string,
    sortType:string):  Observable<any> 
  {
    if(SupplierContractID===0)
    {
      SupplierContractID=0;
    }
    if(SearchSupplierContractCustomers==="")
    {
      SearchSupplierContractCustomers="null";
    }
    if(SearchSupplierContractCustomerPackageTypePercentage==="")
    {
      SearchSupplierContractCustomerPackageTypePercentage="null";
    }
    if(SearchPercentage==="")
    {
      SearchPercentage="null";
    }
    if(SearchFromDate==="")
      {
        SearchFromDate="null";
      }
  
      if(SearchToDate==="")
      {
        SearchToDate="null";
      }
      // if(searchsupplierPercentage==="")
      //   {
      //     searchsupplierPercentage="null";
      //   }
    return this.httpClient.get(this.API_URL + '/'+SupplierContractID +'/'+ SearchSupplierContractCustomers+'/'+SearchSupplierContractCustomerPackageTypePercentage +'/'+SearchPercentage + '/'+SearchFromDate + '/'+SearchToDate + '/'  + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierContractCustomerPackageTypePercentage) 
  {
    
    advanceTable.supplierContractCustomerPackageTypePercentageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractCustomerPackageTypePercentage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractCustomerPackageTypePercentageid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractCustomerPackageTypePercentageid + '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
