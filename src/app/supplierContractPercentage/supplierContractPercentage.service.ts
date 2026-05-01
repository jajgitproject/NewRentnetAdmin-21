// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractPercentage } from './supplierContractPercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractPercentageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractPercentage";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( SupplierContractID:number,SearchSupplierPercentage:string,SearchFromDate:string,
    SearchToDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchSupplierPercentage==="")
    {
      SearchSupplierPercentage="null";
    }
    if(SearchFromDate==="")
      {
        SearchFromDate="null";
      }
  
      if(SearchToDate==="")
      {
        SearchToDate="null";
      }
    return this.httpClient.get(this.API_URL  +  '/'+SupplierContractID + '/'+SearchSupplierPercentage + '/'+SearchFromDate +'/'+SearchToDate+'/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractPercentageID/Ascending');
  }

  getTableDataSort(SupplierContractID:number,SearchSupplierPercentage:string,SearchFromDate:string,
    SearchToDate:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchSupplierPercentage==="")
    {
      SearchSupplierPercentage="null";
    }
    if(SearchFromDate==="")
      {
        SearchFromDate="null";
      }
  
      if(SearchToDate==="")
      {
        SearchToDate="null";
      }
    return this.httpClient.get(this.API_URL  + '/'+ SupplierContractID + '/'+SearchSupplierPercentage + '/'+SearchFromDate +'/'+SearchToDate+'/'+ SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierContractPercentage) 
  {
    
    advanceTable.supplierContractPercentageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractPercentage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractPercentageid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractPercentageid + '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
