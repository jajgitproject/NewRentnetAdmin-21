// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupplierContractVehiclePercentage } from './supplierContractVehiclePercentage.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class SupplierContractVehiclePercentageService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "supplierContractVehiclePercentage";
    this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData( SupplierContractID:number,SearchSupplierContractVehiclePercentage:string,SearchPercentage:string,SearchFromDate:string,
    SearchToDate:string,SearchVechile:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {

    if(SearchSupplierContractVehiclePercentage==="")
    {
      SearchSupplierContractVehiclePercentage="null";
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
      if(SearchVechile==="")
        {
          SearchVechile="null";
        }
    return this.httpClient.get(this.API_URL  +  '/'+SupplierContractID + '/'+SearchSupplierContractVehiclePercentage + '/'+SearchPercentage +'/'+SearchFromDate +'/'+SearchToDate +'/'+SearchVechile + '/' + SearchActivationStatus +'/' + PageNumber + '/supplierContractVehiclePercentageID/Ascending');
  }

  getTableDataSort(SupplierContractID:number,SearchSupplierContractVehiclePercentage:string,SearchPercentage:string,SearchFromDate:string,
    SearchToDate:string,SearchVechile:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    
    if(SearchSupplierContractVehiclePercentage==="")
    {
      SearchSupplierContractVehiclePercentage="null";
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
      if(SearchVechile==="")
        {
          SearchVechile="null";
        }
    return this.httpClient.get(this.API_URL  + '/'+ SupplierContractID + '/'+SearchSupplierContractVehiclePercentage +'/'+SearchPercentage +'/'+SearchFromDate +'/'+SearchToDate+'/'+SearchVechile + '/'+SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: SupplierContractVehiclePercentage) 
  {
    
    advanceTable.supplierContractVehiclePercentageID=-1;
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: SupplierContractVehiclePercentage)
  {
    advanceTable.userID=this.generalService.getUserID();
    advanceTable.fromDateString=this.generalService.getTimeApplicable(advanceTable.fromDate);
    advanceTable.toDateString=this.generalService.getTimeApplicableTO(advanceTable.toDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(supplierContractVehiclePercentageid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ supplierContractVehiclePercentageid + '/'+ userID);
  }
  GetEmployeeData(employeeID: number):  Observable<any> 
  {
    return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  }
}
