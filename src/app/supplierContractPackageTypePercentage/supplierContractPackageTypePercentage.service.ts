// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractPackageTypePercentage } from './supplierContractPackageTypePercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractPackageTypePercentageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractPackageTypePercentage";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData(SupplierContractID:number ,SearchSupplierContractPackageTypePercentage:string,SearchPercentage:string,SearchFromDate:string,
    SearchToDate:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {

    if(SearchSupplierContractPackageTypePercentage==="")
    {
      SearchSupplierContractPackageTypePercentage="null";
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
    return this.httpClient.get(this.API_URL  + '/'+SupplierContractID + '/'+SearchSupplierContractPackageTypePercentage + '/'+SearchPercentage +'/'+SearchFromDate +'/'+SearchToDate+ '/'+ SearchActivationStatus +'/' + PageNumber + '/supplierContractPackageTypePercentageID/Ascending');
  }

  getTableDataSort(SupplierContractID:number,SearchSupplierContractPackageTypePercentage:string,SearchPercentage:string,SearchFromDate:string,SearchToDate:string,SearchActivationStatus:boolean,
     PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchSupplierContractPackageTypePercentage==="")
    {
      SearchSupplierContractPackageTypePercentage="null";
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
    return this.httpClient.get(this.API_URL  + '/'+SupplierContractID + '/'+SearchSupplierContractPackageTypePercentage +'/'+SearchPercentage +'/'+SearchFromDate +'/'+SearchToDate + '/'+ SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierContractPackageTypePercentage) 
  {
  
    advanceTable.supplierContractPackageTypePercentageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractPackageTypePercentage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractPackageTypePercentageid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractPackageTypePercentageid + '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
