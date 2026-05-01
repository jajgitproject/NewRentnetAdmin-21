// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractCityPercentage } from './supplierContractCityPercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractCityPercentageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractCityPercentage";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( SupplierContractID:number,SearchSupplierContractCityPercentage:string,SearchPercentage:string,SearchFromDate:string,
    SearchToDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {

    if(SearchSupplierContractCityPercentage==="")
    {
      SearchSupplierContractCityPercentage="null";
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
        
    return this.httpClient.get(this.API_URL  +  '/'+SupplierContractID + '/'+SearchSupplierContractCityPercentage + '/'+SearchPercentage + '/'+SearchFromDate + '/'+SearchToDate + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractCityPercentageID/Ascending');
  }

  getTableDataSort(SupplierContractID:number,SearchSupplierContractCityPercentage:string,SearchPercentage:string, SearchFromDate:string,
    SearchToDate:string,SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchSupplierContractCityPercentage==="")
    {
      SearchSupplierContractCityPercentage="null";
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
      
    return this.httpClient.get(this.API_URL  + '/'+ SupplierContractID + '/'+SearchSupplierContractCityPercentage + '/'+SearchPercentage + '/' +SearchFromDate + '/'+SearchToDate + '/'+ SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierContractCityPercentage) 
  {
    
    advanceTable.supplierContractCityPercentageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractCityPercentage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractCityPercentageid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractCityPercentageid + '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
