// @ts-nocheck
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangeKamForCustomers } from './changeKamForCustomers.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GeneralService } from '../general/general.service';
@Injectable()
export class ChangeKamForCustomersService 
{
  private API_URL:string = '';
  isTblLoading = true;
  date : any;
  private Employee_API_URL:string = '';
  Result:string='Failure';
  constructor(private httpClient: HttpClient, public generalService: GeneralService) 
  {
    this.API_URL=generalService.BaseURL+ "customerKAMChange";
    //this.Employee_API_URL=generalService.BaseURL+ "employee";

  }
  /** CRUD METHODS */
  getTableData(SearchEmployeeName:string,SearchFromDate:string,SearchActivationStatus:boolean, PageNumber: number):  Observable<any> 
  {
  if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchFromDate==="")
    {
      SearchFromDate="null";
    }
     if(SearchActivationStatus===null)
    {
      SearchActivationStatus=null;
    }
 
   
    //console.log(this.API_URL + '/'+CustomerID +'/'+SearchnewKAMActivationFromDate  + '/' + SearchStartDate+'/' + SearchEndDate +'/' + SearchActivationStatus +'/' + PageNumber + '/changeKamForCustomersID/Ascending')
    return this.httpClient.get(this.API_URL + '/'+SearchEmployeeName +'/'+SearchFromDate +'/' + SearchActivationStatus +'/' + PageNumber + '/keyAccountManagerUpdateID/Ascending');
  }

  getTableDataSort(SearchEmployeeName:string,SearchnewKAMActivationFromDate:string, SearchnewKAMActivationStatus:boolean, PageNumber: number,coloumName:string,sortType:string):  Observable<any> 
  {
     if(SearchEmployeeName==="")
    {
      SearchEmployeeName="null";
    }
    if(SearchnewKAMActivationFromDate==="")
    {
      SearchnewKAMActivationFromDate="null";
    }
    if(SearchnewKAMActivationStatus===null)
    {
      SearchnewKAMActivationStatus=null;
    }
 
    //console.log(this.API_URL + "/kkk" +SearchChangeKamForCustomers + '/' + SearchActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType)
    return this.httpClient.get(this.API_URL + '/'+SearchEmployeeName +'/' + SearchnewKAMActivationFromDate +'/' + SearchnewKAMActivationStatus +'/' + PageNumber + '/'+coloumName+'/'+sortType);
  }

  add(advanceTable: ChangeKamForCustomers) 
  {
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.customerKeyAccountManagerID=-1;
    advanceTable.newKAMActivationFromDateString=this.generalService.getTimeApplicable(advanceTable.newKAMActivationFromDate);
   // advanceTable.endDateString=this.generalService.getTimeApplicableTO(advanceTable.endDate);
    return this.httpClient.post<any>(this.API_URL , advanceTable);
  }
  update(advanceTable: ChangeKamForCustomers)
  {
    advanceTable.userID=this.generalService.getUserID();

    advanceTable.newKAMActivationFromDateString=this.generalService.getTimeApplicable(advanceTable.newKAMActivationFromDate);
    return this.httpClient.put<any>(this.API_URL , advanceTable);
  }
  delete(changeKamForCustomersid: number):  Observable<any> 
  {
    let userID=this.generalService.getUserID();
    return this.httpClient.delete(this.API_URL + '/'+ changeKamForCustomersid+ '/'+ userID);
  }
  // GetEmployeeData(employeeID: number):  Observable<any> 
  // {
  //   return this.httpClient.get(this.Employee_API_URL + '/'+ employeeID);
  // }
}
