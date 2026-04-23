// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
import { UnlockEmployee } from './unlockEmployee.model';
@Injectable()
export class UnlockEmployeeService 
{
  private API_URL:string = '';
  private API_URL_auth:string='';
  isTblLoading = true;
  date : any;
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL= generalService.UnlockEmployeeUrl+"EmployeeEntity";
    this.API_URL_auth=generalService.BaseURL+ "auth";
  }

  getUnlockData(data:UnlockEmployee)
  {
    debugger;
    // row.employeeEntityPasswordID; 
    // data.userType="Employee";
    return this.httpClient.post<any>(this.API_URL_auth + '/unlock-account',data);
  }


  /** CRUD METHODS */
  getTableData(SearchName:string ,IsLockedOut:boolean,PageNumber: number):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(IsLockedOut===null)
      {
        IsLockedOut=null;
      }
    return this.httpClient.get(this.API_URL + '/GetAllEmployeeForUnlock' +  "/" +SearchName + '/' +IsLockedOut + '/'  + PageNumber + '/EmployeeEntityID/Ascending');
  }

  getTableDataSort(SearchName:string,IsLockedOut:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
    if(SearchName==="")
    {
      SearchName="null";
    }
    if(IsLockedOut===null)
      {
        IsLockedOut=null;
      }
    
    
    return this.httpClient.get(this.API_URL + '/GetAllEmployeeForUnlock' + "/" +SearchName + '/'+IsLockedOut + '/'  + PageNumber +  '/'+coloumName+'/'+sortType);
  }
  // add(advanceTable: UnlockEmployee) 
  // {
  //   advanceTable.employeeID=-1;
  //   //advanceTable.contractValidUpToString=this.generalService.getTimeApplicable(advanceTable.contractValidUpTo);
  //  // advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
  //   return this.httpClient.post<any>(this.API_URL , advanceTable);
  // }
  update(advanceTable: UnlockEmployee)
  { 
    //advanceTable.contractValidUpToString=this.generalService.getTimeApplicable(advanceTable.contractValidUpTo);
    // advanceTable.dateOfLeavingString=this.generalService.getTimeApplicableTO(advanceTable.dateOfLeaving);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(employeeID: number):  Observable<any> 
  {
    return this.httpClient.delete(this.API_URL + '/'+ employeeID);
  }
}

