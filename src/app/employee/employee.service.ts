// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from './employee.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class EmployeeService 
{
  private API_URL:string = '';
  private API_URL_Driver:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "employee";
    this.API_URL_Driver=generalService.BaseURL+ "driver";
  }

  getPassword(referenceID:number,type:any):  Observable<any> 
  {
    return this.httpClient.get(this.API_URL_Driver + '/GetDriverPassword' + "/" + referenceID + "/" + type);
  }
  /** CRUD METHODS */
  getTableData(SearchName:string,SearchSupplierName:string, SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchSupplierName === "")
    {
      SearchSupplierName = "null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/' + SearchSupplierName + '/' + SearchActivationStatus +'/' + PageNumber + '/employeeID/Ascending');
  }
  getTableDataSort(SearchName:string,SearchSupplierName:string, SearchActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(SearchSupplierName === "")
    {
      SearchSupplierName = "null";
    }
    if(SearchActivationStatus===null)
    {
      SearchActivationStatus = null;
    }
    return this.httpClient.get(this.API_URL + "/" +SearchName + '/' + SearchSupplierName + '/' + SearchActivationStatus +'/' + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  add(advanceTable: Employee) 
  {
    advanceTable.employeeID=-1;
    advanceTable.userID=this.generalService.getUserID();
    //advanceTable.contractValidUpToString=this.generalService.getTimeApplicable(advanceTable.contractValidUpTo);
    advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: Employee)
  { 
    advanceTable.userID=this.generalService.getUserID();
    //advanceTable.contractValidUpToString=this.generalService.getTimeApplicable(advanceTable.contractValidUpTo);
    advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(employeeID: number):  Observable<any> 
  {
    let userID = this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ employeeID + '/'+ userID);
  }
}
